export type MiningCellTargetPoint = {
  cellIndex: number;
  row: number;
  col: number;
  xPercent: number;
  yPercent: number;
};

const FACE_WIDTH_PERCENT = 67.1;
const STAGE_WIDTH_PX = 480;
const STAGE_HEIGHT_PX = 436;
const FACE_CENTER_Y_PERCENT = 46;

const FACE_HEIGHT_PERCENT = FACE_WIDTH_PERCENT * (STAGE_WIDTH_PX / STAGE_HEIGHT_PX);
const FACE_LEFT_PERCENT = (100 - FACE_WIDTH_PERCENT) / 2;
const FACE_TOP_PERCENT = FACE_CENTER_Y_PERCENT - FACE_HEIGHT_PERCENT / 2;

export function getMiningCellTargetPoint(cellIndex: number): MiningCellTargetPoint {
  const clampedIndex = Math.min(8, Math.max(0, Math.floor(cellIndex)));
  const row = Math.floor(clampedIndex / 3);
  const col = clampedIndex % 3;
  return {
    cellIndex: clampedIndex,
    row,
    col,
    xPercent: FACE_LEFT_PERCENT + (col + 0.5) * (FACE_WIDTH_PERCENT / 3),
    yPercent: FACE_TOP_PERCENT + (row + 0.5) * (FACE_HEIGHT_PERCENT / 3)
  };
}

