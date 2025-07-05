type HeaderEditorProps = {
  props: {
    title?: string
    navLinks?: string[]
  }
  onChange: (newProps: Partial<HeaderEditorProps['props']>) => void
}
export default function HeaderEditor({ props, onChange }: HeaderEditorProps) {
  const links = props.navLinks || []

  const updateLink = (index: number, value: string) => {
    const updated = [...links]
    updated[index] = value
    onChange({ navLinks: updated })
  }

  const addLink = () => {
    onChange({ navLinks: [...links, ''] })
  }

  const removeLink = (index: number) => {
    const updated = [...links]
    updated.splice(index, 1)
    onChange({ navLinks: updated })
  }

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block font-semibold mb-1">Title</label>
        <input
          type="text"
          value={props.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Enter site title"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Navigation Links</label>
        {links.map((link, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={link}
              onChange={(e) => updateLink(index, e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1"
              placeholder="Link name"
            />
            <button
              onClick={() => removeLink(index)}
              type="button"
              className="text-red-600 px-2 py-1 hover:text-red-800"
            >
              &#x2715;
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLink}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          + Add Link
        </button>
      </div>
    </form>
  )
}