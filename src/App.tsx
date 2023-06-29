import { useEffect, useState, useRef, ChangeEvent } from 'react'
import StackGrid from 'react-stack-grid'
import { Image, Spin } from 'antd'
import SearchInput from './Components/SearchInput'
import './App.css'

const apiKey = '35dbb10a16c82d347711c723bc53ae8a'
const noJsonCallback = 1
const format = 'json'
const methodRecent = 'flickr.photos.getRecent'
const methodSearch = 'flickr.photos.search'
const perPage = 50

interface Photo {
  farm?: number
  server?: string
  id?: string
  secret?: string
  title?: string
  isfamily?: number
  isfriend?: number
  ispublic?: number
  owner?: string
}

function App() {
  const [imagesList, setImagesList] = useState<Photo[]>([])
  const [searchResults, setSearchResults] = useState<Photo[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll)
    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [page])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (searchQuery.trim() === '') {
      setSearchResults([])
      return
    }
    const debounceFetchSearchResults = () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        fetchSearchResults()
      }, 500)
    }

    debounceFetchSearchResults()

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [searchQuery, page])

  async function fetchSearchResults() {
    const apiUrl = `https://www.flickr.com/services/rest/?method=${methodSearch}&api_key=${apiKey}&format=${format}&nojsoncallback=${noJsonCallback}&text=${searchQuery}&page=${page}&per_page=${perPage}`

    try {
      setLoading(true)
      const response = await fetch(apiUrl)
      const data = await response.json()
      const photos = data.photos?.photo || []
      setSearchResults((prevResults) => [...prevResults, ...photos])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchData() {
    const safeSearch = 1
    const apiUrl = `https://api.flickr.com/services/rest/?method=${methodRecent}&api_key=${apiKey}&format=${format}&nojsoncallback=${noJsonCallback}&safe_search=${safeSearch}&page=${page}&per_page=${perPage}`

    try {
      setLoading(true)
      const response = await fetch(apiUrl)
      const data = await response.json()
      const photos = data.photos?.photo || []
      setImagesList((prevData) => [...prevData, ...photos])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleScroll = () => {
    const container = containerRef.current
    if (
      container &&
      container?.scrollTop + container?.clientHeight >=
        (container?.scrollHeight ?? 0) - 20 &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1)
    }
  }
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const renderImages = () => {
    const images = searchQuery.trim() === '' ? imagesList : searchResults
    return images.map((image) => (
      <Image
        src={`https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`}
        alt={image.title}
        className="gallery-img"
        id={image.id}
        key={image.id}
      />
    ))
  }

  return (
    <div className="image-gallery-container">
      <SearchInput
        searchQuery={searchQuery}
        handleInputChange={handleInputChange}
      />

      <div
        className="image-gallery"
        ref={containerRef}
        style={{ height: '90vh', overflow: 'auto' }}
      >
        <StackGrid
          columnWidth={window.innerWidth / 6}
          gutterWidth={20}
          gutterHeight={20}
        >
          {renderImages()}
        </StackGrid>

        {loading ? (
          <div className="loader">
            <Spin />
            <div>Loading...</div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default App
