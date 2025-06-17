export default async function FakeTimeoutForSkeletons() {
  const enabled = false; // Disabled to prevent content animation issues
  if (enabled) {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}
