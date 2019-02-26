import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class Pagination extends Component {
  render() {
    return (
      <ul className='pagination rounded-flat pagination-primary d-flex justify-content-center'>
        <li
          className={this.props.prevDisabled ? 'page-item invisible' : 'page-item'}
          onClick={() => { this.props.setPageNumber(this.props.pageNumber - 1) }}>
          <a className='page-link' aria-label='Next'>
            <span aria-hidden='true'>&laquo;</span>
            <span className='sr-only'>Previous</span>
          </a>
        </li>

        {
          this.props.paginationButtons.map((page, i) => {
            return (
              <li key={i} className={this.props.pageNumber === page ? 'page-item active' : 'page-item'}>
                <span className='page-link pointer' onClick={() => { this.props.setPageNumber(page) }}>{page}</span>
              </li>
            )
          })
        }

        <li
          className={this.props.nextDisabled ? 'page-item invisible' : 'page-item'}
          onClick={() => { this.props.setPageNumber(this.props.pageNumber + 1) }}>
          <a className='page-link' aria-label='Next'>
            <span aria-hidden='true'>&raquo;</span>
            <span className='sr-only'>Next</span>
          </a>
        </li>
      </ul>
    )
  }
}

Pagination.propTypes = {
  prevDisabled: PropTypes.bool,
  nextDisabled: PropTypes.bool,
  setPageNumber: PropTypes.func,
  pageNumber: PropTypes.number,
  paginationButtons: PropTypes.array
}
