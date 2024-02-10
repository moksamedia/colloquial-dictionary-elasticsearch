const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const assert = require('assert');
const fs = require('fs')

async function run () {


    async function process(dbFile, source, table, definiendumKey, definitionKey, idField) {

        // Mahavyutpatti (sanskrit tibetan)

        let db = await open({
              filename: dbFile,
              driver: sqlite3.Database
            })


        let jsonFile = source + '.json'
        if (fs.existsSync(jsonFile)) {
          console.log("Removing " + jsonFile)
          fs.rmSync(jsonFile)
        }

        let result = await db.all("SELECT * FROM "+table);

        let data = []

        for (const row of result) {

          const _id = row[idField]
          assert(_id)
          const id = source+"_"+_id

          const documentLine = {
            definition: row[definitionKey],
            definiendum: row[definiendumKey],
            source: source,
            id: id
          }

          if (!documentLine.definition) {
            console.log("SKIPPING, definition null")
            console.log(JSON.stringify(documentLine))
          }
          else if (!documentLine.definiendum) {
            console.log("SKIPPING, definiendum null")
            console.log(JSON.stringify(documentLine))
          }
          else {

            assert(documentLine.definition)
            assert(documentLine.definiendum)
            assert(documentLine.source)
            assert(documentLine.id)

            data.push(documentLine)
          }

        }

        fs.appendFileSync(jsonFile, JSON.stringify(data)+"\n", 'utf8')

        await db.close()

    }

  async function processMonlam() {

    return await process(
      './phurba/monlam-database.sqlite',
      'monlam_tib_tib',
      'table_en_ind',
      'word',
      'result',
      '_id'
    )

    return await process(
      './phurba/monlam-database.sqlite',
      'monlam_tib_eng',
      'table_ind_en',
      'word',
      'result',
      '_id'
    )

/*
    let db = await open({
          filename: './phurba/monlam-database.sqlite',
          driver: sqlite3.Database
        })

    // monlam tib tib

    let source = 'monlam_tib_tib'
    let jsonFile = source + '.json'
    if (fs.existsSync(jsonFile)) {
      console.log("Removing " + jsonFile)
      fs.rmSync(jsonFile)
    }

    let result = await db.all("SELECT * FROM table_en_ind");

    let data = []

    for (const row of result) {

      const _id = row._id
      assert(_id)
      const id = source+"_"+_id

      const documentLine = {
        definition: row.result,
        definiendum: row.word,
        source: source,
        id: id

      }

      data.push(documentLine)
    }

    fs.appendFileSync(jsonFile, JSON.stringify(data)+"\n", 'utf8')

    // monlam eng tib

    source = 'monlam_tib_eng'

    jsonFile = source + '.json'
    if (fs.existsSync(jsonFile)) {
      console.log("Removing " + jsonFile)
      fs.rmSync(jsonFile)
    }

    data = []

    result = await db.all("SELECT * FROM table_ind_en");

    for (const row of result) {
      const _id = row._id
      assert(_id)
      const id = source+"_"+_id

      //console.log(jsonFile + ":processing for id = "+id),
      const documentLine = {
        definition: row.result,
        definiendum: row.word,
        source: source,
        id: id,
      }
      data.push(documentLine)

    }

    fs.appendFileSync(jsonFile, JSON.stringify(data)+"\n", 'utf8')

    await db.close()
*/
  }

  async function processMahavyutpatti() {
      // Mahavyutpatti (sanskrit tibetan)
      return await process(
        './phurba/mp_dict.sqlite',
        'phurba_mahavyutpatti',
        'words',
        'word',
        'definition',
        'word_id'
      )
  }

  async function processRangjungYeshe() {
      // Rangjung Yeshe
      return await process(
        './phurba/ry_dict.sqlite',
        'phurba_rangjung_yeshe',
        'words',
        'word',
        'definition',
        'word_id'
      )
  }

  async function processTshigMdzod() {
    // Tshig Mdzod Chen Mo
    return await process(
      './phurba/tibet_dict.sqlite',
      'phurba_tshig_mdzod_chen_mo',
      'words',
      'word',
      'definition',
      'word_id'
    )
  }

  async function processDagYig() {
    // Dag Yig Gsar Bsgrigs
    return await process(
      './phurba/nt_dict.sqlite',
      'phurba_dag_yig_gsar_bsgrigs',
      'words',
      'word',
      'definition',
      'word_id'
    )
  }

  async function processNewEngTib() {
    // New English Tibetan
    return await process(
      './phurba/net_dict.sqlite',
      'phurba_new_english_tibetan',
      'words',
      'word',
      'definition',
      'word_id'
    )
  }

  async function processTlBo() {
    // New Tibetan Tibetan
    return await process(
      './phurba/TsultrimLodro_dict_bo.sqlite',
      'phurba_tsultrim_lodro_tib_tib',
      'words',
      'word',
      'definition',
      'word_id'
    )
  }


  async function processTlEn() {
    // New Tibetan English
    return await process(
      './phurba/TsultrimLodro_dict_en.sqlite',
      'phurba_tsultrim_lodro_tib_eng',
      'words',
      'word',
      'definition',
      'word_id'
    )
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
