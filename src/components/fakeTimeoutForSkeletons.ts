export default async function FakeTimeoutForSkeletons() {
  const enabled = true;
  if (enabled) {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}
