const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const assert = require('assert');

const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: 'http://127.0.0.1:9200'
})

async function run () {

  async function processMonlam() {

    let db = await open({
          filename: './phurba/monlam-database.sqlite',
          driver: sqlite3.Database
        })

    // monlam tib tib

    let result = await db.all("SELECT * FROM table_en_ind");

    for (const row of result) {
      const source = 'monlam_tib_tib'
      const _id = row._id
      assert(_id)
      const id = source+"_"+_id
      console.log("Processing for id = "+id)
      await client.index({
              index: source,
              id: id,
              document: {
                definition: row.result,
                definiendum: row.word,
                source: source
              }
            })
      console.log(`- id ${id} created`)
    }

    // monlam eng tib

    result = await db.all("SELECT * FROM table_ind_en");

    for (const row of result) {
      const source = 'monlam_tib_eng'
      const _id = row._id
      assert(_id)
      const id = source+"_"+_id
      console.log("Processing for id = "+id)
      await client.index({
              index: source,
              id: id,
              document: {
                definition: row.result,
                definiendum: row.word,
                source: source
              }
            })
      console.log(`- id ${id} created`)
    }

    await db.close()

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

  await processMonlam()
  await processMahavyutpatti()
  await processRangjungYeshe()
  await processTshigMdzod()
  await processDagYig()
  await processNewEngTib()
  await processTlEn()
  await processTlBo()

}

run().catch(console.log)
