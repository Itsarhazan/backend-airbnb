function makeId(startSymb = '', length = 9) {
    let text = startSymb
    const possible = '0123456789'
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function makeExtId(length) {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function resetLocalStorage() {
    localStorage.clear()
    window.location.reload()
}

Array.prototype.autoSortObj = function (objKey, isAsc) {
    // params:
    // objKey = the key that holds the value to sort by
    // isAsc = the order to sort the elements by, 1 = ascending, -1 = descending
    const sortType = typeof this[0][objKey] === 'string' ? '' : 0
    const sortDir = isAsc ? 1 : -1
    if (typeof (sortType) === 'string') return this.sort((a, b) => a[objKey].toUpperCase().localeCompare(b[objKey].toUpperCase()) * sortDir)
    else if (typeof (sortType) === 'number') return this.sort((a, b) => a[objKey] - b[objKey] * sortDir)
}

module.exports = {
    makeId,
    makeExtId,
    getRandomInt,
    resetLocalStorage
}
