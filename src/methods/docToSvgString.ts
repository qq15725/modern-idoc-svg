import type { Document } from 'modern-idoc'
import { SvgRenderer } from '../renderers'

export function docToSvgString(doc: Document): string {
  return new SvgRenderer(doc).toString()
}
