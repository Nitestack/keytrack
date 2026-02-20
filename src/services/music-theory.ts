export const minFrequency = 400;
export const maxFrequency = 480;

export const chromaticNotes = [
  "C",
  "C♯/D♭",
  "D",
  "D♯/E♭",
  "E",
  "F",
  "F♯/G♭",
  "G",
  "G♯/A♭",
  "A",
  "A♯/B♭",
  "B",
] as const;

/**
 * A transpose key (relative to `C`)
 */
export type TransposeKey =
  | `-${Exclude<ChromaticNote, "C">}`
  | `+${Exclude<ChromaticNote, "C">}`
  | "C";

export const transposeKeys = [
  ...chromaticNotes.slice(1).map((pitch) => `-${pitch}` as const),
  "C",
  ...chromaticNotes.slice(1).map((pitch) => `+${pitch}` as const),
] as TransposeKey[];

/**
 * A chromatic note
 */
export type ChromaticNote = (typeof chromaticNotes)[number];

/**
 * Note info (mainly for frequency to note conversion and it's accuracy)
 */
export interface NoteInfo {
  /**
   * The resulting chromatic note
   */
  note: ChromaticNote;
  /**
   * The octave of the note
   */
  octave: number;
  /**
   * The frequency of the note
   */
  frequency: number;
  /**
   * The cents (accuracy)
   * 0 cent = exact match
   * +/- 100 cent = 1 semitone more
   * +/- 1200 cent = 1 octave more
   */
  cents: number;
}

/**
 * Converts a note into it's frequency in Hz
 * @param note The note
 * @param octave The octave of the note (default `4`)
 * @param baseFrequency The base frequency (default `440`)
 */
export function noteToFrequency(
  note: ChromaticNote,
  octave = 4,
  baseFrequency = 440,
) {
  const noteIndex = chromaticNotes.indexOf(note);
  if (noteIndex === -1) return 0;
  const a4Index = chromaticNotes.indexOf("A");
  const semitoneOffset = noteIndex - a4Index + (octave - 4) * 12;
  return baseFrequency * Math.pow(2, semitoneOffset / 12);
}

/**
 * Converts a frequency into a note name
 * @param frequency The frequency of the note
 * @param baseFrequency The base frequency (default `440`)
 */
export function frequencyToNote(
  frequency: number,
  baseFrequency = 440,
): NoteInfo | undefined {
  if (frequency <= 0 || !Number.isFinite(frequency)) return;

  const semitoneOffset = 12 * Math.log2(frequency / baseFrequency);
  const noteIndexRaw = chromaticNotes.indexOf("A") + semitoneOffset;
  const index = ((Math.round(noteIndexRaw) % 12) + 12) % 12;
  const octave = 4 + Math.floor(Math.round(noteIndexRaw) / 12);
  const note = chromaticNotes[index];
  if (!note) return;
  const targetFrequency = noteToFrequency(note, octave, baseFrequency);
  return {
    note,
    octave,
    frequency,
    cents: Math.round(1200 * Math.log2(frequency / targetFrequency)),
  };
}

/**
 * Returns the amount of semitones relative to `C`
 * @param transposeKey The transpose key
 */
export function getSemitonesByTransposeKey(transposeKey: TransposeKey): number {
  const index = transposeKeys.indexOf(transposeKey);
  if (index === -1) return 0;
  return index - 11; // 11 semitones before and 11 semitones after `C`
}
