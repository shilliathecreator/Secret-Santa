/** Uniform rejection sampling over permutations, with cryptographically secure randomness.
 * Server-side use only: never send the complete output to a participant. */
export function drawSecretSanta(ids) {
  if (!Array.isArray(ids) || ids.length < 2 || new Set(ids).size !== ids.length || ids.some(id => typeof id !== 'string' || !id)) throw new Error('En az iki benzersiz katılımcı gerekli.');
  let recipients;
  const randomInt = (max) => {
    const limit = Math.floor(4294967296 / max) * max;
    const buffer = new Uint32Array(1);
    do { crypto.getRandomValues(buffer); } while (buffer[0] >= limit);
    return buffer[0] % max;
  };
  do {
    recipients = [...ids];
    for (let i = recipients.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [recipients[i], recipients[j]] = [recipients[j], recipients[i]];
    }
  } while (recipients.some((id, i) => id === ids[i]));
  return ids.map((giver, i) => ({ giver, recipient: recipients[i] }));
}
