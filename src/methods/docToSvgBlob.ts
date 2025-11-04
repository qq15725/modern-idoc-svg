import type { Document } from 'modern-idoc'
import type { SvgRendererOptions } from '../renderers'
import { SvgRenderer } from '../renderers'

export function docToSvgBlob(doc: Document, options?: SvgRendererOptions): Promise<Blob> {
  return new SvgRenderer(doc, options).toBlob()
}
