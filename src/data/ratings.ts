import "server-only";
import { firestore } from "../firebase/server";
import { Rating } from "@/types/Rating";
import { unstable_cache } from "next/cache";

type getRatingsOptions = {
  filters?: {
    status?: "active" | "inactive" | "draft";
    tourId?: string;
  };
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sorting?: {
    sortBy?: "rating" | "createdDate" | "author";
    sortOrder?: "asc" | "desc";
  };
};

export const getRatings = unstable_cache(
  async (options: getRatingsOptions = {}) => {
    const {
      filters = {},
      pagination = { page: 1, pageSize: 10 },
      sorting = { sortBy: "createdDate", sortOrder: "desc" },
    } = options;

    try {
      console.log("Fetching all ratings for admin panel");
      
      // Get all ratings without complex queries to avoid index issues
      const snapshot = await firestore
        .collection("ratings")
        .get();

      let allRatings: Rating[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdDate: doc.data().createdDate?.toDate() || new Date(),
      })) as Rating[];

      // Apply filters on the client side
      if (filters.status) {
        allRatings = allRatings.filter(rating => rating.status === filters.status);
      }
      if (filters.tourId) {
        allRatings = allRatings.filter(rating => rating.tourId === filters.tourId);
      }

      // Apply sorting
      const { sortBy, sortOrder } = sorting;
      allRatings.sort((a, b) => {
        let aValue: any;
        let bValue: any;
        
        if (sortBy === "rating") {
          aValue = a.rating;
          bValue = b.rating;
        } else if (sortBy === "createdDate") {
          aValue = a.createdDate.getTime();
          bValue = b.createdDate.getTime();
        } else if (sortBy === "author") {
          aValue = a.author;
          bValue = b.author;
        } else {
          aValue = a.createdDate.getTime();
          bValue = b.createdDate.getTime();
        }

        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // Apply pagination
      const page = pagination.page || 1;
      const pageSize = pagination.pageSize || 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedRatings = allRatings.slice(startIndex, endIndex);

      const totalPages = Math.ceil(allRatings.length / pageSize);

      return {
        data: paginatedRatings,
        totalPages,
        currentPage: page,
        totalItems: allRatings.length,
        pageSize,
      };
    } catch (error) {
      console.error("Error fetching ratings:", error);
      return {
        data: [],
        totalPages: 0,
        totalItems: 0,
        currentPage: 1,
        pageSize: 10,
      };
    }
  },
  ["ratings"],
  {
    revalidate: 60,
    tags: ["ratings"],
  }
);

export const getRatingById = unstable_cache(
  async (id: string) => {
    try {
      const doc = await firestore.collection("ratings").doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return {
        id: doc.id,
        ...doc.data(),
        createdDate: doc.data()?.createdDate?.toDate() || new Date(),
      } as Rating;
    } catch (error) {
      console.error("Error fetching rating:", error);
      return null;
    }
  },
  ["rating-by-id"],
  {
    revalidate: 60,
    tags: ["rating"],
  }
);

export const getActiveRatings = unstable_cache(
  async (limit: number = 10) => {
    try {
      console.log("Fetching all ratings and filtering for active ones");
      
      // Get all ratings without filtering or ordering
      const snapshot = await firestore
        .collection("ratings")
        .get();

      console.log("Total documents in ratings collection:", snapshot.size);

      const allRatings: Rating[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Document ID:", doc.id, "Data:", data);
        return {
          id: doc.id,
          ...data,
          createdDate: data.createdDate?.toDate() || new Date(),
        };
      }) as Rating[];

      // Filter for active ratings on the client side
      const activeRatings = allRatings
        .filter(rating => rating.status === "active")
        .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime()) // Sort by newest first
        .slice(0, limit);

      console.log("Filtered active ratings:", activeRatings);
      return activeRatings;
    } catch (error) {
      console.error("Error fetching active ratings:", error);
      return [];
    }
  },
  ["active-ratings"],
  {
    revalidate: 300, // 5 minutes
    tags: ["ratings", "active-ratings"],
  }
);

export const getRatingsByTour = unstable_cache(
  async (tourId: string, limit: number = 5) => {
    try {
      const snapshot = await firestore
        .collection("ratings")
        .where("tourId", "==", tourId)
        .where("status", "==", "active")
        .orderBy("rating", "desc")
        .limit(limit)
        .get();

      const ratings: Rating[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdDate: doc.data().createdDate?.toDate() || new Date(),
      })) as Rating[];

      return ratings;
    } catch (error) {
      console.error(`Error fetching ratings for tour ${tourId}:`, error);
      return [];
    }
  },
  ["ratings-by-tour"],
  {
    revalidate: 300, // 5 minutes
    tags: ["ratings", "tour-ratings"],
  }
);
