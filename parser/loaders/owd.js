/**
 * parser dos dados da Our World in Data
 * https://ourworldindata.org/coronavirus-source-data
*/

const fs = require('fs')
const path = require('path')
const https = require('https')
const { toNumber } = require('lodash')
const Papa = require('papaparse')

const downloadData = url => {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      res
        .on('data', data => resolve(data.toString()))
        .on('error', error => reject(error))
    })
  })
}

const getData = async () => {
  const URL = 'https://covid.ourworldindata.org/data/who/full_data.csv'
  const csvString = await downloadData(URL)

  const result = Papa.parse(csvString, {
    header: true
  })

  return result.data || []
}

const filterByCountry = (data = [], location) => {
  return data.filter(item => {
    return item.location === location
  })
}

const factoryData = item => {
  return {
    date: item.date,
    new_cases: toNumber(item.new_cases),
    new_deaths: toNumber(item.new_deaths),
    cases: toNumber(item.total_cases),
    deaths: toNumber(item.total_deaths)
  }
}

const transformData = (data = []) => data.map(factoryData)

const parserFromOWD = async (country = 'Brazil') => {
  const data = await getData()
  return Promise.resolve(
    transformData(filterByCountry(data, country))
  )
}

module.exports = {
  parserFromOWD
}