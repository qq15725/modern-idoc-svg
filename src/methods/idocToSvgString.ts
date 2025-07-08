import type { Document } from 'modern-idoc'
import { SvgRenderer } from '../renderers'

export function idocToSvgString(idoc: Document): string {
  return new SvgRenderer().toSvgString(idoc)
}
