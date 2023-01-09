// Useful for formatting Zoom recording transcripts into a more readable format. This removes
// all time context from the file, so is good for summarizing and review but not for
// finding the time of a specific comment

const fs = require('fs');

// VTT caption file to operate on
const FILE = 'Week 1/Day 2/GMT20221130-160544_Recording.transcript.vtt';

// Patterns to match VTT timestamp format and the leading name + colon for each speaker line
const timePattern = /\d+\r\n(\d\d:){2}\d\d\.\d{3} --> (\d\d:){2}\d\d\.\d{3}\r\n/g;
const namePattern = /(?<name>\r\n\w+?\s?\w+:\s)(?<words>.*)/g;

// Remove the timestamps
const fileContents = fs.readFileSync(FILE).toString();
const updatedContents = fileContents.replace(timePattern, '');

// Remove subsequent name labels after the first one
const matches = updatedContents.matchAll(namePattern);

let content = '';
let prevName = '';

for (const match of matches) {
  // Extract named capture groups from the regex
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Backreferences#using_named_groups
  const { name, words } = match.groups;

  if (match.groups.name === prevName) {
    content += words;
  } else {
    content += `\n${name}${words}`;
  }
  prevName = match.groups.name;
}

fs.writeFileSync(FILE, content);