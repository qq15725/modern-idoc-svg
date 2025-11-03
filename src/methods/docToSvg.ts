import type { Document } from 'modern-idoc'
import { SvgRenderer } from '../renderers'

export function docToSvg(doc: Document): SVGSVGElement {
  return new SvgRenderer(doc).toDom()
}
