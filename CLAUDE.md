When working in this project, follow these coding guidelines:
    1. NEVER use single-line conditional blocks without braces.
        NO:
            if (condition == true) return 1
        YES:
            if (condition == true)
            {
                return 1
            }
    
    2. Always put curly braces on their own line for blocks of code.
        NO:
            if (condition == true) {
                return 1
            }
        YES:
            if (condition == true)
            {
                return 1
            }
        
        One exception to this is lambda-style syntax, where a function is an argument to something and defined in the same line. In that case, do this:
            useEffect(() => {
                const foo = 1
            }, [])
        
        Additionally, objects defined with braces that are small (like coordinates) can be on a single line:
            const mousePos = {x: 0, y: 0}
    
    3. Variable names should be verbose and descriptive. Code should be easily readable as a result. NEVER use single-letter variables,
        with the exception of 'i', 'j', etc. for for loops when the variable only refers to an index, doesn't represent anything else meaningful, and only exists within that for loop block.
        NO:
            const a = 90
            const mPos = {x: 0, y: 0}
            const remove = false
        YES:
            const angle = 90
            const MousePos = {x: 0, y: 0}
            const shouldRemovePlanet = false
    
    4. Booleans should always be named like a question.
        NO:
            const dragging = false
            cosnt remove = false
            cosnt stopped = false
        YES:
            const isDragging = false
            cosnt shouldRemove = false
            cosnt wasStopped = false
    
    5. Do not attempt to shorten or compress syntax vertically to be more "concise". Prefer readability and verbosity over space.
        Include blank lines to separate logical sections of lines that are related or accomplish the same goal.
        However, don't use more than one blank line in a row.
    
    6. Comment the code extensively. If it is not immediately clear what a section of lines does on a quick glance,
        leave a comment for those lines and separate it vertically from other sections.

    7. Always check conditions that result in immediate return at the start of the function or as soon as the necessary information
        has been determined, and return in that block. Do not indent the entire rest of the function and further nesting as you go.
        Additionally, leave an blank line between the return block and the rest of the function.
        NO:
            useEffect(() => {
                const viewport = viewportRef.current
                if (viewport) {
                    const viewportRect = viewport.getBoundingClientRect()
                }
            })
        YES:
            useEffect(() => {
                const viewport = viewportRef.current
                if (!viewport) {
                    return
                }

                const viewportRect = viewport.getBoundingClientRect()
            })
    