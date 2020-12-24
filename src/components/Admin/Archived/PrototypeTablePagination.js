onClickPage = page => {
    const recordStartIndex = this.state.recordsPerPage * (page-1);
    const activePage = page;
    this.setState({ recordStartIndex, activePage });
}

onClickPagePrev = () => {
    let page = this.state.activePage;
    if(page !== 1) page--;
    this.onClickPage(page);
}

onClickPageNext = noOfPages => {
    let page = this.state.activePage;
    if(page !== noOfPages) page++;
    this.onClickPage(page);
}

renderPagination = (totalRecords) => {
    let pages = [];   
    const noOfPages = Math.ceil(totalRecords / this.state.recordsPerPage);
    const indexPage = this.state.activePage > 2 ? 
    this.state.activePage + 1 >= noOfPages ? noOfPages - 4 : this.state.activePage - 2 : 1
    const stopPage = noOfPages <= indexPage + 4 ? noOfPages : indexPage + 4

    for(var i = indexPage; i <= stopPage; i++){
        const page = i;
        pages.push(
            <button key={page} className={this.getPageClasses(page)}
            onClick={() => this.onClickPage(page)}>{page}</button>
        )
    }

    return(
        <div className="btn-toolbar justify-content-end mb-4" role="toolbar">
            <div className="btn-group" role="group">
                <button className={this.getPrevPageClasses()}
                onClick={() => this.onClickPagePrev()}>
                    <i className="fa fa-long-arrow-alt-left"></i>
                    <span className="d-none d-sm-inline ml-1">Prev</span>
                </button>
                { this.renderBackPage(indexPage, 1) }
                { [pages] }
                { this.renderContinuePage(stopPage, noOfPages) }
                <button className={this.getNextPageClasses(noOfPages)}
                onClick={() => this.onClickPageNext(noOfPages)}>
                    <i className="fa fa-long-arrow-alt-right"></i>
                    <span className="d-none d-sm-inline ml-1">Next</span>
                </button>
            </div>
        </div>
    );
}

renderBackPage = (indexPage, pageLowerLimit) => {
    if(indexPage > pageLowerLimit) {
        const pageNo = indexPage - 1;
        return (
            <button key={pageNo} className={this.getPageClasses(pageNo)}
            onClick={() => this.onClickPage(pageNo)}>...</button>
        );
    }
}

renderContinuePage = (stopPage, pageUpperLimit) => {
    if(stopPage < pageUpperLimit) {
        const pageNo = stopPage + 1;
        return (
            <button key={pageNo} className={this.getPageClasses(pageNo)}
            onClick={() => this.onClickPage(pageNo)}>...</button>
        );
    }
}

getPageClasses = page => {
    let classes = "btn ";
    classes+= page === this.state.activePage ? "active-button" : "btn-outline-dark"
    return classes;
}

getPrevPageClasses = () => {
    let classes = "btn ";
    classes+= this.state.activePage === 1 ? "pagination-disabled" : "btn-outline-dark pagination-nav"
    return classes;
}

getNextPageClasses = noOfPages => {
    let classes = "btn ";
    classes+= this.state.activePage === noOfPages ? "pagination-disabled" : "btn-outline-dark pagination-nav"
    return classes;
}