import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEqual } from './utils/helpers'

export class Patables extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentPage: this.props.startingPage || 1,
      resultSet: this.props.resultSet || 10,
      totalPages: Math.ceil(this.props.initialData.length / this.props.resultSet),
      initialData: this.props.initialData || [],
      sortColumn: this.props.sortColumn || '',
      sortOrder: this.props.sortOrder || 'asc',
      pageNeighbours: this.props.pageNeighbours || 2
    }

    this.sortByColumn = this.sortByColumn.bind(this)
    this.setColumnSortToggle = this.setColumnSortToggle.bind(this)
    this.setPageNumber = this.setPageNumber.bind(this)
    this.setResultSet = this.setResultSet.bind(this)
    this.getVisibleData = this.getVisibleData.bind(this)
    this.range = this.range.bind(this)
    this.getPagination = this.getPagination.bind(this)
    this.getRenderProps = this.getRenderProps.bind(this)
  }

  // LIFECYCLE METHODS
  componentDidMount() {
    if (this.state.initialData.length > 0) {
      let totalPages = Math.ceil(this.state.initialData.length / this.state.resultSet)
      this.setState(() => ({ totalPages }))
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.initialData, this.props.initialData)) {
      let initialData = this.props.initialData
      let totalPages = Math.ceil(initialData.length / this.state.resultSet)
      this.setState(() => ({ initialData, totalPages }))
    }
  }

  // SORTING
  sortByColumn(array) {
    let order = this.state.sortOrder.toLowerCase()

    return array.sort((a, b) => {
      var x = a[this.state.sortColumn]
      var y = b[this.state.sortColumn]

      if (typeof x === 'string') { x = ('' + x).toLowerCase() }
      if (typeof y === 'string') { y = ('' + y).toLowerCase() }

      if (order === 'desc') {
        return ((x < y) ? 1 : ((x > y) ? -1 : 0))
      } else {
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      }
    })
  }

  setColumnSortToggle(e) {
    let sortColumn = e.target.getAttribute('name')
    let sortOrder = this.state.sortOrder
    if (sortColumn === this.state.sortColumn) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
      sortOrder = 'asc'
    }
    this.setState(() => ({ sortColumn, sortOrder }))
  }

  // CURRENT PAGE
  setPageNumber(currentPage) {
    this.setState(() => ({ currentPage }))
  }

  // RESULT SET
  setResultSet(resultSet) {
    let totalPages = Math.ceil(this.state.initialData.length / resultSet)
    let currentPage = totalPages >= this.state.currentPage ? this.state.currentPage : 1
    this.setState(() => ({ resultSet, totalPages, currentPage }))
  }

  // VISIBLE DATA
  getVisibleData() {
    let { initialData, currentPage, resultSet } = this.state
    let offset = (currentPage - 1) * parseInt(resultSet)
    let topOfRange = offset + parseInt(resultSet)

    if (this.state.sortColumn !== '') {
      initialData = this.sortByColumn(initialData)
    }

    return initialData.filter((d, i) => {
      const visibleData = i >= offset && i < topOfRange
      return visibleData
    })
  }

  // PAGINATION
  range(start, end, step = 1) {
    let i = start
    const range = []

    while (i <= end) {
      range.push(i)
      i += step
    }

    return range
  }

  getPagination() {
    const { currentPage, totalPages, pageNeighbours } = this.state
    const totalNumbers = (pageNeighbours * 2) + 1
    let pages = []

    if (totalPages > totalNumbers) {
      let startPage, endPage

      if (currentPage <= (pageNeighbours + 1)) {
        startPage = 1
        endPage = (pageNeighbours * 2) + 1
      } else if (currentPage > (totalPages - pageNeighbours)) {
        startPage = totalPages - ((pageNeighbours * 2))
        endPage = totalPages
      } else {
        startPage = currentPage - pageNeighbours
        endPage = currentPage + pageNeighbours
      }

      pages = this.range(startPage, endPage)
    } else {
      pages = this.range(1, totalPages)
    }

    return pages
  }

  // CREATING PROPS
  getRenderProps() {
    return {
      ...this.state,
      setColumnSortToggle: this.setColumnSortToggle,
      setPageNumber: this.setPageNumber,
      setResultSet: this.setResultSet,
      nextDisabled: this.state.totalPages === this.state.currentPage,
      prevDisabled: this.state.currentPage === 1,
      visibleData: this.getVisibleData(),
      paginationButtons: this.getPagination()
    }
  }

  render() {
    const renderProps = this.getRenderProps()
    return (
      <div>
        {this.props.renderTable(renderProps)}
      </div>
    )
  }
}

Patables.propTypes = {
  renderTable: PropTypes.func,
  initialData: PropTypes.array,
  resultSet: PropTypes.number,
  startingPage: PropTypes.number,
  sortColumn: PropTypes.string,
  sortOrder: PropTypes.string,
  pageNeighbours: PropTypes.number
}
