const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: 'http://127.0.0.1:9200'
})

async function run () {

   await client.indices.putAlias({
       index: [
         'monlam_tib_eng',
         'monlam_tib_tib',
         'phurba_mahavyutpatti',
         'phurba_rangjung_yeshe',
         'phurba_tshig_mdzod_chen_mo',
         'phurba_new_english_tibetan',
         'phurba_dag_yig_gsar_bsgrigs',
         'phurba_tsultrim_lodro_tib_eng',
         'phurba_tsultrim_lodro_tib_tib'
       ],
       name: 'all_colloquial_dicts'
     });
     console.log("alias all_colloquial_dicts created")
}

run().catch(console.log)
