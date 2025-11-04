import type { Document } from 'modern-idoc'
import type { SvgRendererOptions } from '../renderers'
import { SvgRenderer } from '../renderers'

export function docToSvgString(doc: Document, options?: SvgRendererOptions): Promise<string> {
  return new SvgRenderer(doc, options).toString()
}
