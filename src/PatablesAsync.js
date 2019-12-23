import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isFunction, uriBuilder } from './utils/helpers'
import axios from 'axios'
export default class PatablesAsync extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visibleData: [],
      search: '',
      sortColumn: '',
      currentPage: this.props.pageParam ? this.props.pageParam[1] : 1,
      resultSet: this.props.limitParam ? this.props.limitParam[1] : '',
      sortOrder: this.props.orderByParam ? this.props.orderByParam[1] : '',
      pageNeighbors: this.props.pageNeighbors || 2,
      totalPages: 1,
      isLoading: false
    }
  }

  componentDidMount() {
    this.getVisibleData()
  }

  getVisibleData = () => {
    let uri = this.props.url
    if (this.props.pageParam) {
      uri = uriBuilder(uri, this.props.pageParam[0], this.state.currentPage)
    }
    if (this.props.limitParam) {
      uri = uriBuilder(uri, this.props.limitParam[0], this.state.resultSet)
    }
    if (this.props.searchParam) {
      uri = uriBuilder(uri, this.props.searchParam[0], !this.state.search ? this.props.searchParam[1] : this.state.search)
    }
    if (this.props.apiKey) {
      uri = uriBuilder(uri, this.props.apiKey[0], this.props.apiKey[1])
    }
    if (this.props.sortParam) {
      uri = uriBuilder(uri, this.props.sortParam[0], !this.state.sortColumn ? this.props.sortParam[1] : this.state.sortColumn)
    }
    if (this.props.orderByParam) {
      uri = uriBuilder(uri, this.props.orderByParam[0], this.state.sortOrder)
    }
    if (this.props.customParam) {
      let param = this.props.customParam
      param.map(obj => {
        let paramVal = Object.values(obj)
        uri = uriBuilder(uri, paramVal[0], paramVal[1])
      })
    }
    if (this.props.showURI) {
      console.log('The URI is:', uri)
    }

    this.setState({ isLoading: true }, () => {
      axios.get(uri, this.props.config)
        .then(response => {
          let finalData = { ...response }
          this.props.pathToData && this.props.pathToData.forEach(key => {
            finalData = finalData[key]
          })

          let finalPageTotal = { ...response }
          if (this.props.pathToPageTotal) { 
            this.props.pathToPageTotal.forEach(key => {
              finalPageTotal = finalPageTotal[key]
            })
          }

          this.setState({
            visibleData: finalData,
            totalPages: typeof finalPageTotal !== 'number' ? 1 : finalPageTotal
          })
        })
        .catch(err => {
          console.error('error:', err)
        })
        .finally(() => {
          this.setState({ isLoading: false })
        })
    })
  }

  // SEARCH BOX
  setSearchTerm = (e) => {
    let search = e.target.value
    this.setState(() => ({ search }))
  }

  submitSearch = () => {
    if (this.state.search && this.props.searchParam) {
      this.setState({ currentPage: 1 }, this.getVisibleData)
    } else {
      console.warn('Warning🚨: Cannot search without searchParam.')
    }
  }

  clearSearch = () => {
    this.setState({
      search: '',
      currentPage: 1
    }, this.getVisibleData)
  }

  setColumnSortToggle = (e) => {
    let sortColumn = e.target.getAttribute('name')
    let sortOrder = this.state.sortOrder
    if (sortColumn === this.state.sortColumn) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
      sortOrder = 'asc'
    }
    this.setState(() => ({ sortColumn, sortOrder }), this.getVisibleData)
  }

  // CURRENT PAGE
  setPageNumber = (currentPage) => {
    this.setState(() => ({ currentPage }), this.getVisibleData)
  }

  // RESULT SET AKA LIMIT
  setResultSet = (value) => {
    let resultSet = value

    if (typeof resultSet === 'string') {
      resultSet = parseInt(resultSet)
    }

    this.setState({ currentPage: 1, resultSet }, this.getVisibleData)
  }

  // GENERATE AN ARRAY OF PAGES
  range = (start, end, step = 1) => {
    let i = start
    const range = []
    while (i <= end) {
      range.push(i)
      i += step
    }
    return range
  }

  getPagination() {
    const { currentPage, totalPages, pageNeighbors } = this.state
    const totalNumbers = (pageNeighbors * 2) + 1
    let pages = []
    if (totalPages > totalNumbers) {
      let startPage, endPage
      if (currentPage <= (pageNeighbors + 1)) {
        startPage = 1
        endPage = (pageNeighbors * 2) + 1
      } else if (currentPage > (totalPages - pageNeighbors)) {
        startPage = totalPages - ((pageNeighbors * 2))
        endPage = totalPages
      } else {
        startPage = currentPage - pageNeighbors
        endPage = currentPage + pageNeighbors
      }
      pages = this.range(startPage, endPage)
    } else {
      pages = this.range(1, totalPages)
    }
    return pages
  }

  // CREATING PROPS
  getRenderProps = () => {
    return {
      ...this.state,
      setPageNumber: this.setPageNumber,
      setColumnSortToggle: this.setColumnSortToggle,
      setResultSet: this.setResultSet,
      setSearchTerm: this.setSearchTerm,
      nextDisabled: this.state.totalPages === this.state.currentPage,
      prevDisabled: this.state.currentPage === 1,
      submitSearch: this.submitSearch,
      clearSearch: this.clearSearch,
      paginationButtons: this.getPagination()
    }
  }

  render() {
    const { children, render } = this.props
    const renderProps = this.getRenderProps()
    const renderComp = () => {
      if (render && isFunction(render)) {
        return render(renderProps)
      } else if (children && isFunction(children)) {
        return children(renderProps)
      } else {
        console.warn('Please provide a valid render prop or child.')
        return undefined
      }
    }
    return (
      <div>
        {renderComp()}
      </div>
    )
  }
}

PatablesAsync.propTypes = {
  children: PropTypes.func,
  render: PropTypes.func,
  startingPage: PropTypes.number,
  pageNeighbors: PropTypes.number,
  url: PropTypes.string,
  config: PropTypes.object,
  apiKey: PropTypes.array,
  pageParam: PropTypes.array,
  limitParam: PropTypes.array,
  searchParam: PropTypes.array,
  orderByParam: PropTypes.array,
  sortParam: PropTypes.array,
  customParam: PropTypes.array,
  pathToData: PropTypes.array,
  pathToPageTotal: PropTypes.array,
  showURI: PropTypes.bool
}
