import type { Document } from 'modern-idoc'
import { SvgRenderer } from '../renderers'

export function idocToSvg(idoc: Document): SVGSVGElement {
  return new SvgRenderer().render(idoc)
}
