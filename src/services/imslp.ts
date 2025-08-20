import { load } from "cheerio";

export interface ImslpScore {
  id: string;
  title: string;
  url: string;
  publisher: ImslpScorePublisher;
  pages: string;
  fileSize: string;
  isUrtext: boolean;
}

export interface ImslpScorePublisher {
  name: string;
  date?: string;
  city?: string;
  plate?: string;
}

/**
 * Retrieves the PDF URL (non-permanent) of a score by its IMSLP index URL (permanent)
 * @param url https://imslp.org/wiki/Special:ImagefromIndex/<6-digit index>/qraj
 */
export async function getPdfUrlByIndex(url: string) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Cookie: "imslpdisclaimeraccepted=yes; disclaimer_bypass=OK", // `imslpdisclaimeraccepted` is set when accepting the IMSLP disclaimer with the button
      },
      redirect: "follow",
    });

    if (!response.ok) return undefined;

    const $ = load(await response.text());
    const fileUrlPath = $("a.bigbutton").attr("href");

    if (!fileUrlPath) return undefined;

    return new URL(response.url).origin + fileUrlPath;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

/**
 * Retrieves all scores for a piece from IMSLP by its wiki URL
 * @param wikiUrl https://imslp.org/wiki/<piece>
 */
export async function getScoresByWikiUrl(
  wikiUrl: string,
): Promise<ImslpScore[]> {
  const scores: ImslpScore[] = [];
  try {
    const response = await fetch(wikiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Referer: "https://imslp.org/",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
      },
    });

    if (!response.ok) return [];

    const $ = load(await response.text());

    $("#wpscoresection #tabScore1")
      .children(".we")
      .each((_, scoreElement) => {
        const $pubParentElement = $(scoreElement);

        const $pubElement = $pubParentElement
          .find("table tbody tr .we_edition_info_i table tbody")
          .children("tr")
          .find("th")
          .filter((_, el) => $(el).text().startsWith("Pub"))
          .siblings("td");
        const publisher = htmlToPublisher($pubElement.html() ?? ""); // extensive paring of the different publisher formats

        if (!publisher) return undefined;

        const isUrtext = $pubParentElement
          .find("table tbody tr .we_edition_info_i table tbody")
          .text()
          .toLowerCase()
          .includes("urtext");

        // A publisher can publish multiple scores
        scores.push(
          ...$pubParentElement
            .children()
            .not("table")
            .filter(
              (_, el) =>
                $(el)
                  .find(".we_file_download p span a")
                  .attr("href")
                  ?.endsWith(".pdf") ?? false,
            ) // ensure the score is a PDF
            .map((_, scoreHeadingElement) => {
              const $scoreElement = $(scoreHeadingElement).find(
                ".we_file_download p",
              );

              const [unresolvedId, unresolvedScoreData] = $scoreElement
                .find(".we_file_info2")
                .text()
                .split("-");
              if (!unresolvedId || !unresolvedScoreData) return undefined;

              const id = unresolvedId.replace(/\D/g, ""); // only include digits (ID is generally a 6-digit number)

              const [unresolvedFileSize, unresolvedPages] = unresolvedScoreData
                .trim()
                .split(",");

              if (!unresolvedFileSize || !unresolvedPages) return undefined;

              let title = $scoreElement.find("b a span").text().trim();
              // Generally, the title is "Complete Score", trying to replace it with a more unique title, either the score title (prefered) or the title specified from the sibling element before the `.we` element, if it exists
              if (publisher.title) {
                title = title.replace("Complete Score", publisher.title);
              }

              const url = $scoreElement.find("b a").attr("href");

              if (!url) return undefined;

              return {
                title,
                url,
                id,
                publisher,
                isUrtext,
                fileSize: unresolvedFileSize.trim(),
                pages: unresolvedPages.trim(),
              } satisfies ImslpScore;
            })
            .filter(Boolean), // each `return undefined` means that the parsing has failed
        );
      });
  } catch (err) {
    console.error(err);
  }
  /**
   * Sorting Rules:
   * 1. whether it is Urtext edition or not (must be first because Urtext editions are preferred)
   * 2. publisher (must be second because after Urtext, the autocomplete groupBy property (which is the publisher's name) cannot have duplicates)
   * 3. whether the title is not "Complete Score"
   * 4. title
   */
  return scores.sort(
    (a, b) =>
      (a.isUrtext ? -1 : b.isUrtext ? 1 : 0) ||
      a.publisher.name.localeCompare(b.publisher.name) ||
      (!a.title.toLowerCase().includes("complete score")
        ? -1
        : !b.title.toLowerCase().includes("complete score")
          ? 1
          : 0) ||
      a.title.localeCompare(b.title),
  );
}

/**
 * Parses the raw HTML of a score publisher element into an object
 * @param html The raw HTML of a score publisher element from the IMSLP wiki page
 */
function htmlToPublisher(
  html: string,
): (ImslpScorePublisher & { title?: string }) | undefined {
  const result: ImslpScorePublisher & { title?: string } = {
    name: "",
  };

  const cleanedUpHtml = html
    .trim()
    .split("\n")[0]! // Take only first line if there are single newlines
    .split(/urtext\s/i)[0]! // Take only the part before "urtext" (case-insensitive)
    .split("<div")[0]! // Remove any boxes
    .trim();

  let remainingText = "";

  // if there are two parts, first is always title, second is publisher info
  const splitParts = cleanedUpHtml.split("<br>");
  if (splitParts.length > 1) {
    // we check safely here if there are at least two parts
    result.title = replaceAllHTMLTags(splitParts[0]!);
    remainingText = replaceAllHTMLTags(splitParts[1]!);
  } else {
    remainingText = replaceAllHTMLTags(cleanedUpHtml);
  }

  // City
  if (remainingText.includes(":")) {
    const [city, ...newPublisherParts] = remainingText.split(":");
    result.city = city?.trim();
    remainingText = newPublisherParts.join(":").trim();
  }
  // Plate
  if (remainingText.includes("Plate")) {
    const [newPublisherParts, plate] = remainingText.split("Plate");
    if (!plate || !newPublisherParts) return undefined; // weird parsing error which usually cannot happen (plate definition is after "Plate", before that is publisher name and more)
    result.plate = plate.replace(/\.$/, "").trim();
    remainingText = newPublisherParts.trim();
  }
  const match = /^(.*?)(?:, ([^,]*)\.)?$/.exec(remainingText); // the date has the format "<publisher name>, <date>." (has the last comma and the last dot)
  if (match) {
    const name = match[1];
    if (!name) return undefined; // weird parsing error which usually cannot happen (publisher name is always before the date)
    result.name = name.trim();
    result.date = match[2]?.trim();
  } else {
    result.name = remainingText.trim();
  }
  return result;
}

function replaceAllHTMLTags(text: string) {
  return load(text).text().trim();
}
