import { useState, useEffect, FC, ChangeEvent } from 'react'
import { Dropdown } from 'antd'
import './searchInput.css'

interface SearchInputProps {
  searchQuery: string

  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const SearchInput: FC<SearchInputProps> = ({
  searchQuery,
  handleInputChange,
}) => {
  const [previousHistory, setPreviousHistory] = useState<string[]>([])

  const searchQueryMenu = {
    items: previousHistory
      .slice()
      .reverse()
      .map((item) => ({
        label: item,
        key: item,
      })),
    onClick: (e: { key: string }) => {
      handleInputChange({ target: { value: e.key } } as ChangeEvent<
        HTMLInputElement
      >)
    },
  }

  useEffect(() => {
    const storedItems = localStorage.getItem('previousHistory')
    if (storedItems) {
      setPreviousHistory(JSON.parse(storedItems))
    }
  }, [])

  useEffect(() => {
    if (searchQuery && !previousHistory.includes(searchQuery)) {
      const timer = setTimeout(() => {
        const updatedItems = [...previousHistory, searchQuery]
        setPreviousHistory(updatedItems)
        localStorage.setItem('previousHistory', JSON.stringify(updatedItems))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [searchQuery, previousHistory])

  return (
    <div className="search-input">
      <h2>Image Glimpse</h2>
      {previousHistory.length > 0 ? (
        <Dropdown menu={searchQueryMenu} trigger={['click']}>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleInputChange}
          />
        </Dropdown>
      ) : (
        <input
          type="text"
          placeholder="Search Images..."
          value={searchQuery}
          onChange={handleInputChange}
        />
      )}
    </div>
  )
}

export default SearchInput
