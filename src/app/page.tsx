// 'use client'
// import { useEffect, useState } from 'react'
// import { v4 as uuidv4 } from 'uuid'
// import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
// import Hero from './components/sections/Hero'

// export type HeaderLink = {
//   id: string
//   title: string
//   url: string
// }

// export type FooterItem = {
//   id: string
//   text: string
// }

// export type SectionType = {
//   id: string
//   type: 'header' | 'hero' | 'footer'
//   props: {
//     [key: string]: unknown
//     links?: HeaderLink[]
//     footerItems?: FooterItem[] 
//   }
// }

// export default function Home() {
//   const [sections, setSections] = useState<SectionType[]>([])
//   const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)

//   useEffect(() => {
//     const stored = localStorage.getItem('sections')
//     if (stored) {
//       setSections(JSON.parse(stored))
//     }
//   }, [])

//   useEffect(() => {
//     localStorage.setItem('sections', JSON.stringify(sections))
//   }, [sections])

//   const addSection = (type: SectionType['type']) => {
//     const newSection: SectionType = {
//       id: uuidv4(),
//       type,
//       props: type === 'header' ? { links: [] } : type === 'footer' ? { footerItems: [] } : {},
//     }
//     setSections((prev) => [...prev, newSection])
//     setSelectedSectionId(newSection.id)
//   }

//   const updateSectionProps = (id: string, newProps: Partial<SectionType['props']>) => {
//     setSections((prev) =>
//       prev.map((sec) => (sec.id === id ? { ...sec, props: { ...sec.props, ...newProps } } : sec))
//     )
//   }

//   const deleteSection = (id: string) => {
//     setSections((prev) => prev.filter((sec) => sec.id !== id))
//     if (selectedSectionId === id) setSelectedSectionId(null)
//   }

//   const onDragEnd = (result: DropResult) => {
//     if (!result.destination) return

//     const reordered = Array.from(sections)
//     const [moved] = reordered.splice(result.source.index, 1)
//     reordered.splice(result.destination.index, 0, moved)

//     setSections(reordered)
//   }

//   const exportJSON = () => {
//     const dataStr = JSON.stringify(sections, null, 2)
//     const blob = new Blob([dataStr], { type: 'application/json' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = 'website-builder.json'
//     a.click()
//     URL.revokeObjectURL(url)
//   }

//   const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     const reader = new FileReader()
//     reader.onload = (event) => {
//       try {
//         const importedData = JSON.parse(event.target?.result as string)
//         if (Array.isArray(importedData)) {
//           setSections(importedData)
//           setSelectedSectionId(null)
//         } else {
//           alert('Invalid JSON structure')
//         }
//       } catch {
//         alert('Failed to parse JSON file')
//       }
//     }
//     reader.readAsText(file)
//   }

//   const renderSection = (section: SectionType, index: number) => {
//     const isSelected = selectedSectionId === section.id
//     const baseClasses = 'rounded p-2 cursor-pointer transition-shadow relative'
//     const selectedClasses = isSelected ? 'ring-4 ring-blue-400' : 'hover:shadow-md'

//     return (
//       <Draggable key={section.id} draggableId={section.id} index={index}>
//         {(provided) => (
//           <div
//             {...provided.draggableProps}
//             {...provided.dragHandleProps}
//             ref={provided.innerRef}
//             onClick={() => setSelectedSectionId(section.id)}
//             className={`${baseClasses} ${selectedClasses}`}
//           >
//             {section.type === 'hero' && <Hero {...section.props} />}

//             {section.type === 'header' && (
//               <div className="bg-blue-100 text-blue-800 p-4 rounded space-y-2">
//                 {section.props.links && section.props.links.length > 0 ? (
//                   <ul className="list-disc pl-5">
//                     {section.props.links.map((link: HeaderLink) => (
//                       <li key={link.id}>
//                         <a
//                           href={link.url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="underline"
//                         >
//                           {link.title || 'Untitled Link'}
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="italic text-gray-600">[ No header links added yet ]</p>
//                 )}
//               </div>
//             )}

//             {section.type === 'footer' && (
//               <div className="bg-green-100 text-green-800 p-4 rounded space-y-2">
//                 {section.props.footerItems && section.props.footerItems.length > 0 ? (
//                   <ul className="list-disc pl-5">
//                     {section.props.footerItems.map((item: FooterItem) => (
//                       <li key={item.id}>{item.text || '[ Empty item ]'}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="italic text-gray-600 text-center">
//                     [ Footer section is empty ]
//                   </p>
//                 )}
//               </div>
//             )}

//             <button
//               onClick={(e) => {
//                 e.stopPropagation()
//                 deleteSection(section.id)
//               }}
//               className="absolute top-2 right-2 text-red-600 bg-white rounded-full p-1 shadow hover:bg-red-600 hover:text-white transition"
//               aria-label="Delete section"
//               title="Delete section"
//               type="button"
//             >
//               &#x2715;
//             </button>
//           </div>
//         )}
//       </Draggable>
//     )
//   }

//   const selectedSection = sections.find((sec) => sec.id === selectedSectionId)

//   return (
//     <main className="flex flex-col md:flex-row min-h-screen">
//       {/* Sidebar */}
//       <aside className="w-full md:w-1/4 bg-gray-100 p-4 border-r border-gray-300 flex flex-col">
//         <h2 className="text-xl font-bold mb-4">Section Library</h2>
//         <ul className="space-y-2 mb-6">
//           {['header', 'hero', 'footer'].map((section) => (
//             <li
//               key={section}
//               onClick={() => addSection(section as SectionType['type'])}
//               className="p-2 bg-white shadow rounded cursor-pointer hover:bg-gray-50 transition text-center capitalize"
//             >
//               {section}
//             </li>
//           ))}
//         </ul>

//         {/* Import / Export Buttons */}
//         <div className="mt-auto">
//           <button
//             onClick={exportJSON}
//             className="w-full mb-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
//             type="button"
//           >
//             Export JSON
//           </button>

//           <label
//             htmlFor="import-json"
//             className="w-full cursor-pointer block text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//           >
//             Import JSON
//           </label>
//           <input
//             id="import-json"
//             type="file"
//             accept="application/json"
//             onChange={importJSON}
//             className="hidden"
//           />
//         </div>
//       </aside>

//       {/* Preview Area */}
//       <section className="flex-1 p-6 bg-white">
//         <h2 className="text-xl font-bold mb-4">Live Preview</h2>
//         {sections.length === 0 ? (
//           <div className="border border-dashed border-gray-400 rounded p-6 text-gray-500 text-center">
//             No sections added yet.
//           </div>
//         ) : (
//           <DragDropContext onDragEnd={onDragEnd}>
//             <Droppable droppableId="sections">
//               {(provided) => (
//                 <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
//                   {sections.map((section, index) => renderSection(section, index))}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           </DragDropContext>
//         )}
//       </section>

//       {/* Editor Panel */}
//       <aside className="w-full md:w-1/4 bg-white p-4 border-l border-gray-300 flex flex-col">
//         <h2 className="text-xl font-bold mb-4 flex-shrink-0">Editor</h2>

//         {!selectedSection ? (
//           <p className="text-gray-500">Select a section to edit its properties.</p>
//         ) : (
//           <div className="overflow-y-auto max-h-[calc(100vh-6rem)]">
//             {selectedSection.type === 'hero' ? (
//               <HeroEditor
//                 props={selectedSection.props}
//                 onChange={(newProps) => updateSectionProps(selectedSection.id, newProps)}
//               />
//             ) : selectedSection.type === 'header' ? (
//               <HeaderEditor
//                 props={selectedSection.props}
//                 onChange={(newProps) => updateSectionProps(selectedSection.id, newProps)}
//               />
//             ) : selectedSection.type === 'footer' ? (
//               <FooterEditor
//                 props={selectedSection.props}
//                 onChange={(newProps) => updateSectionProps(selectedSection.id, newProps)}
//               />
//             ) : (
//               <p className="text-gray-500">Editor for {selectedSection.type} not implemented yet.</p>
//             )}
//           </div>
//         )}
//       </aside>
//     </main>
//   )
// }


// type HeroEditorProps = {
//   props: {
//     title?: string
//     subtitle?: string
//     backgroundUrl?: string
//   }
//   onChange: (newProps: Partial<HeroEditorProps['props']>) => void
// }

// function HeroEditor({ props, onChange }: HeroEditorProps) {
//   return (
//     <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
//       <div>
//         <label htmlFor="title" className="block font-semibold mb-1">
//           Title
//         </label>
//         <input
//           id="title"
//           type="text"
//           value={props.title || ''}
//           onChange={(e) => onChange({ title: e.target.value })}
//           className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           placeholder="Enter title"
//         />
//       </div>

//       <div>
//         <label htmlFor="subtitle" className="block font-semibold mb-1">
//           Subtitle
//         </label>
//         <input
//           id="subtitle"
//           type="text"
//           value={props.subtitle || ''}
//           onChange={(e) => onChange({ subtitle: e.target.value })}
//           className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           placeholder="Enter subtitle"
//         />
//       </div>

//       <div>
//         <label htmlFor="backgroundUrl" className="block font-semibold mb-1">
//           Background Image URL
//         </label>
//         <input
//           id="backgroundUrl"
//           type="text"
//           value={props.backgroundUrl || ''}
//           onChange={(e) => onChange({ backgroundUrl: e.target.value })}
//           className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           placeholder="Enter image URL"
//         />
//       </div>
//     </form>
//   )
// }

// // Header 
// type HeaderEditorProps = {
//   props: {
//     links?: HeaderLink[]
//   }
//   onChange: (newProps: Partial<HeaderEditorProps['props']>) => void
// }

// function HeaderEditor({ props, onChange }: HeaderEditorProps) {
//   const links = props.links || []

//   const addLink = () => {
//     const newLink: HeaderLink = {
//       id: uuidv4(),
//       title: '',
//       url: '',
//     }
//     onChange({ links: [...links, newLink] })
//   }

//   const updateLink = (id: string, newLinkData: Partial<HeaderLink>) => {
//     const updatedLinks = links.map((link) =>
//       link.id === id ? { ...link, ...newLinkData } : link
//     )
//     onChange({ links: updatedLinks })
//   }

//   const deleteLink = (id: string) => {
//     const filteredLinks = links.filter((link) => link.id !== id)
//     onChange({ links: filteredLinks })
//   }

//   return (
//     <div className="flex flex-col h-full">
//       {links.length === 0 && (
//         <p className="mb-2 text-gray-500 italic">No links added yet.</p>
//       )}

//       <div className="flex flex-col gap-4 overflow-y-auto max-h-[320px] pr-2">
//         {links.map((link) => (
//           <div
//             key={link.id}
//             className="border border-gray-300 rounded p-3 flex flex-col gap-2 sm:items-center sm:gap-3"
//           >
//             <input
//               type="text"
//               placeholder="Title"
//               value={link.title}
//               onChange={(e) => updateLink(link.id, { title: e.target.value })}
//               className="flex-grow border border-gray-300 rounded px-3 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//             <input
//               type="text"
//               placeholder="URL"
//               value={link.url}
//               onChange={(e) => updateLink(link.id, { url: e.target.value })}
//               className="flex-grow border border-gray-300 rounded px-3 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//             <button
//               onClick={() => deleteLink(link.id)}
//               className="text-red-600 hover:text-red-800 font-bold px-3 py-2 rounded transition flex-shrink-0"
//               aria-label="Delete link"
//               title="Delete link"
//               type="button"
//             >
//               &times;
//             </button>
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={addLink}
//         type="button"
//         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//       >
//         Add Link
//       </button>
//     </div>
//   )
// }

// type FooterEditorProps = {
//   props: {
//     footerItems?: FooterItem[]
//   }
//   onChange: (newProps: Partial<FooterEditorProps['props']>) => void
// }

// function FooterEditor({ props, onChange }: FooterEditorProps) {
//   const footerItems = props.footerItems || []

//   const addFooterItem = () => {
//     const newItem: FooterItem = {
//       id: uuidv4(),
//       text: '',
//     }
//     onChange({ footerItems: [...footerItems, newItem] })
//   }

//   const updateFooterItem = (id: string, newText: string) => {
//     const updatedItems = footerItems.map((item) =>
//       item.id === id ? { ...item, text: newText } : item
//     )
//     onChange({ footerItems: updatedItems })
//   }

//   const deleteFooterItem = (id: string) => {
//     const filteredItems = footerItems.filter((item) => item.id !== id)
//     onChange({ footerItems: filteredItems })
//   }

//   return (
//     <div className="flex flex-col h-full">
//       {footerItems.length === 0 && (
//         <p className="mb-2 text-gray-500 italic">No footer items added yet.</p>
//       )}

//       <div className="flex flex-col gap-4 overflow-y-auto max-h-[320px] pr-2">
//         {footerItems.map((item) => (
//           <div
//             key={item.id}
//             className="border border-gray-300 rounded p-3 flex items-center gap-3"
//           >
//             <textarea
//               value={item.text}
//               onChange={(e) => updateFooterItem(item.id, e.target.value)}
//               className="flex-grow border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
//               rows={2}
//               placeholder="Footer item text"
//             />
//             <button
//               onClick={() => deleteFooterItem(item.id)}
//               className="text-red-600 hover:text-red-800 font-bold px-3 py-2 rounded transition flex-shrink-0"
//               aria-label="Delete footer item"
//               title="Delete footer item"
//               type="button"
//             >
//               &times;
//             </button>
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={addFooterItem}
//         type="button"
//         className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
//       >
//         Add Footer Item
//       </button>
//     </div>
//   )
// }



'use client'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import Hero from './components/sections/Hero'

export type HeaderLink = {
  id: string
  title: string
  url: string
}

export type FooterItem = {
  id: string
  text: string
}

// إعادة تعريف SectionType باستخدام Union Types لتمييز الـ props حسب النوع
export type SectionType =
  | { id: string; type: 'header'; props: { links: HeaderLink[] } }
  | { id: string; type: 'hero'; props: { title?: string; subtitle?: string; backgroundUrl?: string } }
  | { id: string; type: 'footer'; props: { footerItems: FooterItem[] } }

export default function Home() {
  const [sections, setSections] = useState<SectionType[]>([])
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('sections')
    if (stored) {
      setSections(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sections', JSON.stringify(sections))
  }, [sections])

  const addSection = (type: SectionType['type']) => {
    const newSection: SectionType =
      type === 'header'
        ? { id: uuidv4(), type, props: { links: [] } }
        : type === 'footer'
        ? { id: uuidv4(), type, props: { footerItems: [] } }
        : { id: uuidv4(), type, props: {} }
    setSections((prev) => [...prev, newSection])
    setSelectedSectionId(newSection.id)
  }

  const updateSectionProps = (id: string, newProps: Partial<any>) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === id ? { ...sec, props: { ...sec.props, ...newProps } } : sec
      )
    )
  }

  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((sec) => sec.id !== id))
    if (selectedSectionId === id) setSelectedSectionId(null)
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const reordered = Array.from(sections)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)

    setSections(reordered)
  }

  const exportJSON = () => {
    const dataStr = JSON.stringify(sections, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'website-builder.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string)
        if (Array.isArray(importedData)) {
          setSections(importedData)
          setSelectedSectionId(null)
        } else {
          alert('Invalid JSON structure')
        }
      } catch {
        alert('Failed to parse JSON file')
      }
    }
    reader.readAsText(file)
  }

  const renderSection = (section: SectionType, index: number) => {
    const isSelected = selectedSectionId === section.id
    const baseClasses = 'rounded p-2 cursor-pointer transition-shadow relative'
    const selectedClasses = isSelected ? 'ring-4 ring-blue-400' : 'hover:shadow-md'

    return (
      <Draggable key={section.id} draggableId={section.id} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={() => setSelectedSectionId(section.id)}
            className={`${baseClasses} ${selectedClasses}`}
          >
            {section.type === 'hero' && <Hero {...section.props} />}

            {section.type === 'header' && (
              <div className="bg-blue-100 text-blue-800 p-4 rounded space-y-2">
                {section.props.links.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {section.props.links.map((link) => (
                      <li key={link.id}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {link.title || 'Untitled Link'}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-gray-600">[ No header links added yet ]</p>
                )}
              </div>
            )}

            {section.type === 'footer' && (
              <div className="bg-green-100 text-green-800 p-4 rounded space-y-2">
                {section.props.footerItems.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {section.props.footerItems.map((item) => (
                      <li key={item.id}>{item.text || '[ Empty item ]'}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-gray-600 text-center">
                    [ Footer section is empty ]
                  </p>
                )}
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation()
                deleteSection(section.id)
              }}
              className="absolute top-2 right-2 text-red-600 bg-white rounded-full p-1 shadow hover:bg-red-600 hover:text-white transition"
              aria-label="Delete section"
              title="Delete section"
              type="button"
            >
              &#x2715;
            </button>
          </div>
        )}
      </Draggable>
    )
  }

  const selectedSection = sections.find((sec) => sec.id === selectedSectionId)

  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-gray-100 p-4 border-r border-gray-300 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Section Library</h2>
        <ul className="space-y-2 mb-6">
          {['header', 'hero', 'footer'].map((section) => (
            <li
              key={section}
              onClick={() => addSection(section as SectionType['type'])}
              className="p-2 bg-white shadow rounded cursor-pointer hover:bg-gray-50 transition text-center capitalize"
            >
              {section}
            </li>
          ))}
        </ul>

        {/* Import / Export Buttons */}
        <div className="mt-auto">
          <button
            onClick={exportJSON}
            className="w-full mb-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            type="button"
          >
            Export JSON
          </button>

          <label
            htmlFor="import-json"
            className="w-full cursor-pointer block text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Import JSON
          </label>
          <input
            id="import-json"
            type="file"
            accept="application/json"
            onChange={importJSON}
            className="hidden"
          />
        </div>
      </aside>

      {/* Preview Area */}
      <section className="flex-1 p-6 bg-white">
        <h2 className="text-xl font-bold mb-4">Live Preview</h2>
        {sections.length === 0 ? (
          <div className="border border-dashed border-gray-400 rounded p-6 text-gray-500 text-center">
            No sections added yet.
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                  {sections.map((section, index) => renderSection(section, index))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </section>

      {/* Editor Panel */}
      <aside className="w-full md:w-1/4 bg-white p-4 border-l border-gray-300 flex flex-col">
        <h2 className="text-xl font-bold mb-4 flex-shrink-0">Editor</h2>

        {!selectedSection ? (
          <p className="text-gray-500">Select a section to edit its properties.</p>
        ) : (
          <div className="overflow-y-auto max-h-[calc(100vh-6rem)]">
            {selectedSection.type === 'hero' ? (
              <HeroEditor
                props={selectedSection.props}
                onChange={(newProps) => updateSectionProps(selectedSection.id, newProps)}
              />
            ) : selectedSection.type === 'header' ? (
              <HeaderEditor
                props={selectedSection.props}
                onChange={(newProps) => updateSectionProps(selectedSection.id, newProps)}
              />
            ) : selectedSection.type === 'footer' ? (
              <FooterEditor
                props={selectedSection.props}
                onChange={(newProps) => updateSectionProps(selectedSection.id, newProps)}
              />
            ) : (
              <p className="text-gray-500">Editor for {selectedSection.type} not implemented yet.</p>
            )}
          </div>
        )}
      </aside>
    </main>
  )
}

// === Editors ===

type HeroEditorProps = {
  props: {
    title?: string
    subtitle?: string
    backgroundUrl?: string
  }
  onChange: (newProps: Partial<HeroEditorProps['props']>) => void
}

function HeroEditor({ props, onChange }: HeroEditorProps) {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor="title" className="block font-semibold mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={props.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter title"
        />
      </div>

      <div>
        <label htmlFor="subtitle" className="block font-semibold mb-1">
          Subtitle
        </label>
        <input
          id="subtitle"
          type="text"
          value={props.subtitle || ''}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter subtitle"
        />
      </div>

      <div>
        <label htmlFor="backgroundUrl" className="block font-semibold mb-1">
          Background Image URL
        </label>
        <input
          id="backgroundUrl"
          type="text"
          value={props.backgroundUrl || ''}
          onChange={(e) => onChange({ backgroundUrl: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter image URL"
        />
      </div>
    </form>
  )
}

type HeaderEditorProps = {
  props: { links: HeaderLink[] }
  onChange: (newProps: Partial<HeaderEditorProps['props']>) => void
}

function HeaderEditor({ props, onChange }: HeaderEditorProps) {
  const addLink = () => {
    const newLink: HeaderLink = {
      id: uuidv4(),
      title: '',
      url: '',
    }
    onChange({ links: [...props.links, newLink] })
  }

  const updateLink = (id: string, key: keyof HeaderLink, value: string) => {
    const updatedLinks = props.links.map((link) =>
      link.id === id ? { ...link, [key]: value } : link
    )
    onChange({ links: updatedLinks })
  }

  const deleteLink = (id: string) => {
    onChange({ links: props.links.filter((link) => link.id !== id) })
  }

  return (
    <div>
      <button
        type="button"
        onClick={addLink}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Add Link
      </button>
      {props.links.length === 0 && <p className="italic text-gray-600">No links added yet.</p>}
      {props.links.map((link) => (
        <div key={link.id} className="mb-4 border rounded p-3">
          <div className="mb-2">
            <label htmlFor={`title-${link.id}`} className="block font-semibold mb-1">
              Title
            </label>
            <input
              id={`title-${link.id}`}
              type="text"
              value={link.title}
              onChange={(e) => updateLink(link.id, 'title', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Link title"
            />
          </div>

          <div className="mb-2">
            <label htmlFor={`url-${link.id}`} className="block font-semibold mb-1">
              URL
            </label>
            <input
              id={`url-${link.id}`}
              type="text"
              value={link.url}
              onChange={(e) => updateLink(link.id, 'url', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Link URL"
            />
          </div>

          <button
            type="button"
            onClick={() => deleteLink(link.id)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Delete Link
          </button>
        </div>
      ))}
    </div>
  )
}

type FooterEditorProps = {
  props: { footerItems: FooterItem[] }
  onChange: (newProps: Partial<FooterEditorProps['props']>) => void
}

function FooterEditor({ props, onChange }: FooterEditorProps) {
  const addItem = () => {
    const newItem: FooterItem = {
      id: uuidv4(),
      text: '',
    }
    onChange({ footerItems: [...props.footerItems, newItem] })
  }

  const updateItem = (id: string, value: string) => {
    const updatedItems = props.footerItems.map((item) =>
      item.id === id ? { ...item, text: value } : item
    )
    onChange({ footerItems: updatedItems })
  }

  const deleteItem = (id: string) => {
    onChange({ footerItems: props.footerItems.filter((item) => item.id !== id) })
  }

  return (
    <div>
      <button
        type="button"
        onClick={addItem}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Add Footer Item
      </button>
      {props.footerItems.length === 0 && (
        <p className="italic text-gray-600">No footer items added yet.</p>
      )}
      {props.footerItems.map((item) => (
        <div key={item.id} className="mb-4 border rounded p-3">
          <div>
            <label htmlFor={`footer-item-${item.id}`} className="block font-semibold mb-1">
              Text
            </label>
            <input
              id={`footer-item-${item.id}`}
              type="text"
              value={item.text}
              onChange={(e) => updateItem(item.id, e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Footer item text"
            />
          </div>

          <button
            type="button"
            onClick={() => deleteItem(item.id)}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Delete Item
          </button>
        </div>
      ))}
    </div>
  )
}
