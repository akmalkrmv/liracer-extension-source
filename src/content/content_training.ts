// Example href link of single puzzle
// https://lichess.org/training/Iy8iI

import {STORAGE_KEYS} from '../shared/consts';
import {MessageTypes} from '../shared/messages';
import {PuzzleId} from '../shared/models';
import {attachCustomStylesIntoDocumentHead, appendNextUnsolvedLink} from '../shared/ui/training-page-helpers';
import {PUZZLE_FEEDBACK_SELECTOR, PUZZLE_FEEDBACK_SUCCESS_SELECTOR} from '../shared/ui/selectors';

type PuzzleLink = string | undefined;
type TrainingGroup = {type: 'racer' | 'storm'; date: number; puzzles: string[]};

(function () {
  const extractLastSegment = (href: string) => href.split('/').filter(Boolean).pop()!;

  // Extract puzzle ID (last path segment)
  const puzzleId: PuzzleId | undefined = extractLastSegment(location.pathname); // e.g. "Iy8iI"

  // Attach styles
  attachCustomStylesIntoDocumentHead();

  // Observe dynamic DOM
  const observer = new MutationObserver(() => checkIfPuzzleSolved());
  observer.observe(document.body, {childList: true, subtree: true});

  function checkIfPuzzleSolved(): void {
    const isPuzzleSolved: Element | null = document.querySelector(PUZZLE_FEEDBACK_SUCCESS_SELECTOR);
    if (!isPuzzleSolved) return;

    chrome.runtime.sendMessage({type: MessageTypes.puzzle_solved_single, id: puzzleId});

    // Optional: auto-close puzzle tab after solving
    // chrome.runtime.sendMessage({ type: "close_tab" });

    const nextPuzzleContainer: Element | null = document.querySelector(PUZZLE_FEEDBACK_SELECTOR);
    if (!nextPuzzleContainer) return;

    // Handle puzzles that got into training
    chrome.storage.local.get([STORAGE_KEYS.TRAINING], (data) => {
      const training = data[STORAGE_KEYS.TRAINING] as TrainingGroup | undefined;
      if (!training?.puzzles?.length) return;

      const unsolvedPuzzles: PuzzleLink[] = training.puzzles
        .map((link: string) => extractLastSegment(link)) // map to puzzle id
        .filter((id: PuzzleLink) => id !== puzzleId);

      if (!unsolvedPuzzles?.length) return;

      const remaining: number = unsolvedPuzzles.length;
      const nextUnsolvedPuzzleLink: PuzzleLink = unsolvedPuzzles.pop();

      appendNextUnsolvedLink(nextPuzzleContainer, nextUnsolvedPuzzleLink, remaining);
    });

    observer.disconnect();

    return;
  }

  // Also check once on load (in case feedback appears instantly)
  checkIfPuzzleSolved();
})();
