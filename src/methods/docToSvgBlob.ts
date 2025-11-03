import type { Document } from 'modern-idoc'
import { SvgRenderer } from '../renderers'

export function docToSvgBlob(doc: Document): Blob {
  return new SvgRenderer(doc).toBlob()
}
