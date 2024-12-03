export interface DocumentationPageTreeItem {

  id: string

  title: string

  children?: DocumentationPageTreeItem[]

}

export const DOC_TREE: DocumentationPageTreeItem[] = [
  {
    id: "overview",
    title: "Overview"
  },
  {
    id: "decorators",
    title: "Decorators"
  },
  {
    id: "behind-the-scenes",
    title: "Behind the scenes"
  }
]