import { toBlob } from 'html-to-image';


export async function copyDivToClipboard(element: HTMLElement) {
    if (!element) return false;

    const blob: Blob | null = await toBlob(element);

    if (!blob) return false;

    await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
    ]);
    
    return true;
}