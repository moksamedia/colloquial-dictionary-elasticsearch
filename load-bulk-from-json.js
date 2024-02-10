const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const assert = require('assert');
const fs = require('fs')
const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: 'http://127.0.0.1:9200'
})

async function run () {

  async function processSource(source) {
    console.log("processing source: " + source )
    let json = JSON.parse(fs.readFileSync(source+'.json','utf8'))
    let operations = json.flatMap(doc => [{ index: { _index: source, _id:doc.id } }, doc])

    const chunkSize = 50000
    for (let i = 0; i < operations.length; i += chunkSize) {
        const chunk = operations.slice(i, i + chunkSize);
        console.log(`Chunk ${i}, size=${chunk.length}`)
        let bulkResponse = await client.bulk({ refresh: true, operations:chunk })

        if (bulkResponse.errors) {
          const erroredDocuments = []
          // The items array has the same order of the dataset we just indexed.
          // The presence of the `error` key indicates that the operation
          // that we did for the document has failed.
          bulkResponse.items.forEach((action, i) => {
            const operation = Object.keys(action)[0]
            if (action[operation].error) {
              erroredDocuments.push({
                // If the status is 429 it means that you can retry the document,
                // otherwise it's very likely a mapping error, and you should
                // fix the document before to try it again.
                status: action[operation].status,
                error: action[operation].error,
                operation: operations[i * 2],
                document: operations[i * 2 + 1]
              })
            }
          })
          console.log(erroredDocuments)
        }

        console.log(`Chunk ${i} done`)
    }

  }

  await processSource('phurba_mahavyutpatti')
  await processSource('phurba_rangjung_yeshe')
  await processSource('phurba_tshig_mdzod_chen_mo')
  await processSource('phurba_dag_yig_gsar_bsgrigs')
  await processSource('phurba_new_english_tibetan')
  await processSource('phurba_tsultrim_lodro_tib_tib')
  await processSource('phurba_tsultrim_lodro_tib_eng')
  await processSource('monlam_tib_eng')
  await processSource('monlam_tib_tib')

/*
  async function processMonlam() {

    // monlam tib tib


    let source = 'monlam_tib_eng'
    let json = JSON.parse(fs.readFileSync(source+'.json','utf8'))
    let operations = json.flatMap(doc => [{ index: { _index: source, _id:doc.id } }, doc])
    let bulkResponse = await client.bulk({ refresh: true, operations })
    console.log(`${source} result = ` + JSON.stringify(bulkResponse))

    // monlam eng tib

    source = 'monlam_tib_tib'
    let json = JSON.parse(fs.readFileSync(source+'.json','utf8'))
    operations = json.flatMap(doc => [{ index: { _index: source } }, doc])
    bulkResponse = await client.bulk({ refresh: true, operations })
    console.log(`${source} result = ` + JSON.stringify(bulkResponse))

  }

  async function processMahavyutpatti() {

      // Mahavyutpatti (sanskrit tibetan)

      let db = await open({
            filename: './phurba/mp_dict.sqlite',
            driver: sqlite3.Database
          })


      let result = await db.all("SELECT * FROM words");

      for (const row of result) {
        const source = 'phurba_mahavyutpatti'
        const _id = row.word_id
        assert(_id)
        const id = source+"_"+_id
        console.log("Processing for id = "+id)
        await client.index({
                index: 'phurba_mahavyutpatti',
                id: id,
                document: {
                  definition: row.definition,
                  definiendum: row.word,
                  source: source
                }
              })
        console.log(`- id ${id} created`)
      }
      await db.close()

  }

  async function processRangjungYeshe() {

      // Rangjung Yeshe

      let db = await open({
            filename: './phurba/ry_dict.sqlite',
            driver: sqlite3.Database
          })


      let result = await db.all("SELECT * FROM words");

      for (const row of result) {
        const source = 'phurba_rangjung_yeshe'
        const _id = row.word_id
        assert(_id)
        const id = source+"_"+_id
        console.log("Processing for id = "+id)
        await client.index({
                index: source,
                id: id,
                document: {
                  definition: row.definition,
                  definiendum: row.word,
                  source: source
                }
              })
        console.log(`- id ${id} created`)
      }
      await db.close()

  }

  async function processTshigMdzod() {

    // Tshig Mdzod Chen Mo

    let db = await open({
          filename: './phurba/tibet_dict.sqlite',
          driver: sqlite3.Database
        })

    let result = await db.all("SELECT * FROM words");

    for (const row of result) {
      const source = 'phurba_tshig_mdzod_chen_mo'
      const _id = row.word_id
      assert(_id)
      const id = source+"_"+_id
      await client.index({
              index: source,
              id: id,
              document: {
                definition: row.definition,
                definiendum: row.word,
                source: source
              }
            })
      console.log(`- id ${id} created`)
    }

    await db.close()

  }

  async function processDagYig() {

    // Dag Yig Gsar Bsgrigs

    let db = await open({
          filename: './phurba/nt_dict.sqlite',
          driver: sqlite3.Database
        })

    let result = await db.all("SELECT * FROM words");

    for (const row of result) {
      const source = 'phurba_dag_yig_gsar_bsgrigs'
      const _id = row.word_id
      assert(_id)
      const id = source+"_"+_id
      console.log("Processing for id = "+id)
      await client.index({
              index: source,
              id: id,
              document: {
                definition: row.definition,
                definiendum: row.word,
                source: source
              }
            })
      console.log(`- id ${id} created`)
    }
    await db.close()

  }

  async function processNewEngTib() {

    // New English Tibetan

    let db = await open({
          filename: './phurba/net_dict.sqlite',
          driver: sqlite3.Database
        })

    let result = await db.all("SELECT * FROM words");

    for (const row of result) {
      const source = 'phurba_new_english_tibetan'
      const _id = row.word_id
      assert(_id)
      const id = source+"_"+_id
      console.log("Processing for id = "+id)
      await client.index({
              index: source,
              id: id,
              document: {
                definition: row.definition,
                definiendum: row.word,
                source: source
              }
            })
      console.log(`- id ${id} created`)
    }
    await db.close()

  }

  async function processTlBo() {

    // New Tibetan Tibetan

    let db = await open({
          filename: './phurba/TsultrimLodro_dict_bo.sqlite',
          driver: sqlite3.Database
        })

    let result = await db.all("SELECT * FROM words");

    for (const row of result) {
      const source = 'phurba_tsultrim_lodro_tib_tib'
      const _id = row.word_id
      assert(_id)
      const id = source+"_"+_id
      console.log("Processing for id = "+id)
      await client.index({
              index: source,
              id: id,
              document: {
                definition: row.definition,
                definiendum: row.word,
                source: source
              }
            })
      console.log(`- id ${id} created`)
    }

    await db.close()

  }


  async function processTlEn() {
    // New Tibetan English

    let db = await open({
          filename: './phurba/TsultrimLodro_dict_en.sqlite',
          driver: sqlite3.Database
        })

    let result = await db.all("SELECT * FROM words");

    for (const row of result) {
      const source = 'phurba_tsultrim_lodro_tib_eng'
      const _id = row.word_id
      assert(_id)
      const id = source+"_"+_id
      console.log("Processing for id = "+id)
      await client.index({
              index: source,
              id: id,
              document: {
                definition: row.definition,
                definiendum: row.word,
                source: source
              }
            })
      console.log(`- id ${id} created`)
    }
    await db.close()
  }
  */

  //await processMonlam()
  //await processMahavyutpatti()
  //await processRangjungYeshe()
  //await processTshigMdzod()
  //await processDagYig()
  //await processNewEngTib()
  //await processTlEn()
  //await processTlBo()

}

run().catch(console.log)
