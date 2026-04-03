'use client';

// @ts-ignore
import { toPng } from 'html-to-image';

export async function exportMatchTicket(elementId: string, fileName: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // 🏷️ CAPTURE WITH HIGH-DPI (2x SCALE)
    const dataUrl = await toPng(element, {
      pixelRatio: 2,
      quality: 1,
      cacheBust: true,
    });

    // 📥 DOWNLOAD TRIGGER
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to export match ticket:', error);
    throw error;
  }
}
