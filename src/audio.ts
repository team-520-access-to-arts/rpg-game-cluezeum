/** Some browsers expose speech properties without a usable implementation. */
export function canNarrate(host: {speechSynthesis?: {speak?: unknown; cancel?: unknown}; SpeechSynthesisUtterance?: unknown}): boolean {
  return typeof host.speechSynthesis?.speak === 'function' && typeof host.speechSynthesis?.cancel === 'function' && typeof host.SpeechSynthesisUtterance === 'function';
}
