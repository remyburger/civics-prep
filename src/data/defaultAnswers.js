// Defaults for the handful of questions whose correct answer depends on who
// currently holds office, or on the applicant's state. Prefilled where a stable
// current answer is known; the app always shows a reminder to verify before
// the actual interview since these can change.
export const DEFAULT_VARIABLE_ANSWERS = {
  president: "Donald J. Trump",
  vp: "JD Vance",
  speaker: "Mike Johnson",
  chiefJustice: "John Roberts",
  senators: "John Hickenlooper and Michael Bennet",
  representative: "", // depends on the applicant's specific congressional district
  governor: "Jared Polis",
  stateCapital: "Denver",
};

export const VARIABLE_FIELD_LABELS = {
  president: "President",
  vp: "Vice President",
  speaker: "Speaker of the House",
  chiefJustice: "Chief Justice of the United States",
  senators: "Your state's U.S. senators",
  representative: "Your U.S. representative",
  governor: "Your state's governor",
  stateCapital: "Your state's capital",
};
