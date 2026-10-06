export type ReceiptData = {
  gymName: string;
  gymAddress: string;
  gymPhone: string;
  receiptNo: string;
  memberName: string;
  memberPhone: string;
  plan: string;
  amount: string;
  paidOn: string;
  method: string;
  note: string | null;
  totalPaid: string;
  planPrice: string;
  balance: string;
};

const WIDTH = 900;
const INK = "#14120d";
const INK_SOFT = "#55503f";
const PAPER = "#f3eee3";
const PAPER_2 = "#eae2d0";
const GOLD = "#f6a821";
const LINE = "#d9cfb8";

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cursorY);
  return cursorY + lineHeight;
}

/** Draws a payment receipt onto a canvas and returns it as a PNG blob. */
export async function renderReceiptPng(data: ReceiptData): Promise<Blob> {
  const rows: [string, string][] = [
    ["Plan", data.plan],
    ["Amount received", data.amount],
    ["Paid on", data.paidOn],
    ["Method", data.method],
    ...(data.note ? ([["Note", data.note]] as [string, string][]) : []),
    ["Total paid to date", data.totalPaid],
    ["Plan price", data.planPrice],
    ["Balance remaining", data.balance],
  ];
  const height = 420 + rows.length * 44;

  const canvas = document.createElement("canvas");
  const scale = 2; // crisp on retina/phone screens
  canvas.width = WIDTH * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.scale(scale, scale);

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, WIDTH, height);

  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, WIDTH, 12);
  ctx.fillStyle = GOLD;
  ctx.fillRect(0, 12, WIDTH, 4);

  let y = 70;
  ctx.fillStyle = INK;
  ctx.font = "700 30px Arial";
  ctx.fillText(data.gymName, 48, y);
  ctx.font = "400 14px Arial";
  ctx.fillStyle = INK_SOFT;
  y += 28;
  ctx.fillText(data.gymAddress, 48, y);
  y += 20;
  ctx.fillText(data.gymPhone, 48, y);

  ctx.textAlign = "right";
  ctx.font = "700 22px Arial";
  ctx.fillStyle = GOLD;
  ctx.fillText("PAYMENT RECEIPT", WIDTH - 48, 70);
  ctx.font = "400 13px Arial";
  ctx.fillStyle = INK_SOFT;
  ctx.fillText(`#${data.receiptNo}`, WIDTH - 48, 92);
  ctx.textAlign = "left";

  y = 150;
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(48, y);
  ctx.lineTo(WIDTH - 48, y);
  ctx.stroke();

  y += 40;
  ctx.font = "700 16px Arial";
  ctx.fillStyle = INK;
  ctx.fillText("Billed to", 48, y);
  y += 26;
  ctx.font = "400 16px Arial";
  y = wrapText(ctx, data.memberName, 48, y, WIDTH - 96, 22);
  ctx.fillStyle = INK_SOFT;
  ctx.font = "400 14px Arial";
  ctx.fillText(data.memberPhone, 48, y);

  y += 40;
  ctx.fillStyle = PAPER_2;
  ctx.fillRect(48, y, WIDTH - 96, rows.length * 44 + 20);
  y += 44;

  for (const [label, value] of rows) {
    ctx.font = "400 14px Arial";
    ctx.fillStyle = INK_SOFT;
    ctx.fillText(label, 70, y);
    ctx.textAlign = "right";
    ctx.font = "700 16px Arial";
    ctx.fillStyle = INK;
    ctx.fillText(value, WIDTH - 70, y);
    ctx.textAlign = "left";
    y += 44;
  }

  y += 30;
  ctx.font = "italic 13px Arial";
  ctx.fillStyle = INK_SOFT;
  ctx.fillText("Thank you for training with us.", 48, y);

  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not render receipt"))), "image/png")
  );
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
