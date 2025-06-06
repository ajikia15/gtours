// Migration script to convert tour fields from old structure to new array structure
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

// Firebase config - you'll need to add your actual config here
const firebaseConfig = {
  // Add your Firebase config here
  // You can copy this from your src/firebase/client.ts file
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface OldTour {
  id: string;
  title?: string;
  titleEn?: string;
  titleGE?: string;
  titleRU?: string;
  description?: string;
  descriptionEn?: string;
  descriptionGE?: string;
  descriptionRU?: string;
  [key: string]: any;
}

interface NewTour {
  title: string[];
  subtitle: string[];
  description: string[];
  [key: string]: any;
}

function migrateTourFields(oldTour: OldTour): Partial<NewTour> {
  const updates: Partial<NewTour> = {};

  // Migrate title fields
  if (oldTour.titleEn || oldTour.titleGE || oldTour.titleRU || oldTour.title) {
    updates.title = [
      oldTour.titleEn || oldTour.title || "",
      oldTour.titleGE || "",
      oldTour.titleRU || "",
    ];
  }

  // Migrate description fields
  if (
    oldTour.descriptionEn ||
    oldTour.descriptionGE ||
    oldTour.descriptionRU ||
    oldTour.description
  ) {
    updates.description = [
      oldTour.descriptionEn || oldTour.description || "",
      oldTour.descriptionGE || "",
      oldTour.descriptionRU || "",
    ];
  }

  // Add subtitle field (empty for now, you can populate later)
  updates.subtitle = ["", "", ""];

  return updates;
}

async function migrateTours() {
  try {
    console.log("Starting tour migration...");

    // Get all tours from Firestore
    const toursRef = collection(db, "tours");
    const snapshot = await getDocs(toursRef);

    console.log(`Found ${snapshot.docs.length} tours to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const docSnapshot of snapshot.docs) {
      const tourData = docSnapshot.data() as OldTour;
      const tourId = docSnapshot.id;

      console.log(`Processing tour: ${tourId}`);

      // Check if tour already has the new array structure
      if (
        Array.isArray(tourData.title) &&
        Array.isArray(tourData.description)
      ) {
        console.log(`  - Skipping ${tourId} (already migrated)`);
        skippedCount++;
        continue;
      }

      // Migrate the tour
      const updates = migrateTourFields(tourData);

      if (Object.keys(updates).length > 0) {
        const tourRef = doc(db, "tours", tourId);
        await updateDoc(tourRef, updates);

        console.log(`  - Migrated ${tourId}`);
        console.log(`    Title: [${updates.title?.join(", ")}]`);
        console.log(
          `    Description lengths: [${updates.description
            ?.map((d) => d.length)
            .join(", ")}]`
        );

        migratedCount++;
      } else {
        console.log(`  - No updates needed for ${tourId}`);
        skippedCount++;
      }
    }

    console.log("\nMigration completed!");
    console.log(`  - Migrated: ${migratedCount} tours`);
    console.log(`  - Skipped: ${skippedCount} tours`);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Run the migration
migrateTours().then(() => {
  console.log("Migration script finished successfully");
  process.exit(0);
});
