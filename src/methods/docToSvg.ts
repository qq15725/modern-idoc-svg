import type { Document } from 'modern-idoc'
import type { SvgRendererOptions } from '../renderers'
import { SvgRenderer } from '../renderers'

export function docToSvg(doc: Document, options?: SvgRendererOptions): Promise<SVGSVGElement> {
  return new SvgRenderer(doc, options).toDom()
}
