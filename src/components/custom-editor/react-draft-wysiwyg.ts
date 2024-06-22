import dynamic from 'next/dynamic'
import { EditorProps } from 'react-draft-wysiwyg'

const ReactDraftWysiwyg = dynamic<EditorProps>(() => import('react-draft-wysiwyg').then(mod => mod.Editor), {
  ssr: false
})
export default ReactDraftWysiwyg
//hiểu đơn giản là nó ko có render server nữa chỉ ở client thôi
