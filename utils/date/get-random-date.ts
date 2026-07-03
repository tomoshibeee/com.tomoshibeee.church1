export function getRandomDate(): string {
  const now = new Date();
  const past = new Date();
  past.setFullYear(now.getFullYear() - 1);

  const randomTime =
    past.getTime() + Math.random() * (now.getTime() - past.getTime());

  return new Date(randomTime).toISOString();
}