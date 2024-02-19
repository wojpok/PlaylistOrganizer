"use client"

import { useMemo } from "react";
import "./HistoryEntry.scss"

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function d10() { return getRandomNumber(0, 9) } 

export default function HistoryEntry({seq}) {
  const opt = useMemo(() => generate(root), [seq])

  return (
    <div className="history-entry">
      {opt}
    </div>
  )
}

type StringGenerator = () => string
type Table = (string | StringGenerator)[]

function generate(val: Table | StringGenerator | string): string {
  if(typeof(val) === "string")
    return val

  if(typeof(val) === "function")
    return val()

  const choice = val[getRandomNumber(0, val.length - 1)]

  return generate(choice)
}

const friendsAndEnemies = () => {
  const isFriend = d10() <= 5

  if (isFriend) {
    const tab0_ = generate([
      "kobietę", "mężczyznę"
    ])

    const wrapp = name => `Jest dla ciebie jak ${name}`


    const tab0 = generate([
      wrapp("młodsze rodzeństwo"),
      wrapp("starsze rodzeństwo"),
      wrapp("nauczyciel / mentor"),
      wrapp("rodzic"),
      "Pogodziła się z danwym wrogiem",
      "Odnowiła kontakty ze starym krewnym",
      "Połączył je wspólny cel",
      "Odnowiła kontakty z przyjacielem z dawnych czasów",
    ])

    return `
    Twoja postać znalazła przyjaciela ${tab0_}.\n
    ${tab0}.
    `
  }
  else {
    const tab0 = generate([
      "Wróg jest kobietą",
      "Wróg jest mężczyzną",
    ])

    const tab1 = generate([
      "dawnym przyjacielem / przyjaciółką",
      "dawnym kochanekiem / kochanką",
      "krewnym",
      "wrogiem z dzieciństwa",
      "kimś kto dla ciebie pracował",
      "kimś dla kogo pracowałaś/eś",
      "wspólnikiem / współpracownikiem",
      "członkiem gangu / mafii",
      "kierownikiem przedsiębiorstwa",
      "urzędnikiem / osobą publiczna",
      "kapłanem/ką w lokalnej świątyni",
    ])

    const tab2_ = generate([
      "Twoja postać",
      "Postać wroga"
    ])

    const tab2 = generate([
      "spowodowała że druga straciła twarz",
      "spowodowała stratę kochanka, przyjaciela lub krewnego",
      "spowodowała znaczne upokorzenie",
      "wytknęła drugiemu tchórzostwo lub inną wadę publicznie",
      "spowodowała fizyczne obrażenia",
      "opuściła / zdradziła drugiego",
      "odrzuciła ofertę miłości / pracy",
      "była miłosnym rywalem",
      "zawaliła plan drugiego",
    ])

    const tab3 = generate([
      "druga postać nienawidzi twojej postaci",
      "twoja postać nienawidzi drugiej",
      "nienawiść jest obustronna",
    ])

    const tab4_ = generate([
      "pogrążyłaby się w niekontrolowanym szale, masakrując drugiej twarz",
      "unikałaby dupka",
      "załatwiłaby twoją postać podstępem",
      "kompletnie zignorowała",
      "wyżyłaby się słowami"
    ])

    const tab4 = generate([
      "tylko samego siebie",
      "tylko samego siebie",
      "tylko samego siebie",
      "siebie i kilku przyjaciół",
      "siebie i kilku przyjaciół",
      "gang",
      "władze porządkowe",
      "władze porządkowe",
      "armię królewską",
    ])

    return `
      Twoja postać dorobiła się wroga. \n
      ${tab0}, ${tab1}. \n
      ${tab2_} ${tab2};  ${tab3}. \n
      Strona poszkodowana przy spotkaniu ${tab4_}. \n
      Do pomocy ma ${tab4}. \n
    `
  }
}

function romance() {
  const choice = d10()

  if(choice <= 4) {
    return "Twoja postać miała szczęśliwą przygodę miłosną."
  }

  if (choice >= 8) {
    return "Twoja postać miała króciutki epizod miłosny."
  }

  if(choice >= 6) {
    const tab0 = generate([
      "przyjaciele / rodzina partnera twojej postaci cię nienawidzi",
      "przyjaciele / rodzina partnera twojej postaci zrobiłaby wszystko, żeby się pozbyć",
      "przyjaciele / rodzina twojej rodziny nienawidzą tego partnera",
      "jedno z nich ma miłosnego rywala",
      "zostali w jakiś sposób rozdzieleni",
      "twoja postać wciąż walczysz o wględy drugiej strony, z marnym powodzeniem",
      "są profesjonalnymi rywalami",
      "jedno z nich jest chorobliwie zazdrosne",
      "jedno z nich  tu bruździ",
      "mają przeciwstawne pochodzenie i rodziny",
      "partner został zmuszony do wstąpnienia do klasztoru"
    ])

    return `
      Twoja postać ma trudny epizod romantyczny. \n
      Obie strony się zakochały, ale ${tab0}.
    `
  }

  const tab0 = generate([
    "partner zginął w wypadku",
    "partner tajemniczo zniknął",
    "związek się udał, jesteści pokłóceni",
    "osobisty cel / wandetta stanęła między zakochanymi",
    "partner został porwany",
    "partner oszalał",
    "partner popełnił samobójstwo",
    "partner został zabity w walce",
    "partner wyłączył twoją postać z rozgrywki",
    "partner został uwięziony / wygnany",
  ])

  const tab1 = generate([
    "Twoja postać ciągle go kocha",
    "W głębi duszy twoja postać wie, że druga osoba ciągle ją kocha",
    "W głębi duszy twoja postać wie, że ciągle się kochają nawzajem",
    "Twoja postać go nienawidzi",
    "W głębi duszy twoja postać wie, że druga osoba nienawidzi jej",
    "W głębi duszy twoja postać wie, że się nienawidziecie wzajemnie",
    "Rozstaliście się jako przyjaciele",
    "Niestety miłość ostygła, rozeszliście się",
    "Relacja tych postaci to trudny przypadek love-hate z obu stron"
  ])

  return `
    Twoja postać zakochała się tragicznie.\n
    Niestety ${tab0}.\n
    ${tab1}.\n
  `
}

const chances = () => {
  const choice = d10()

  if(choice % 2 === 0) {
    const tab0 = generate([
      () => "wytworzyła koneksje w " + generate(["radzie miasta", "lokalnej mafii", "armii królewskiej", "w rządzie kraju"]),
      "z sukcesem powiększyła swój majątek o (do ustalenia z GM)",
      "wygrała dużą kwotę w grze hazerdowej",
      "znalazła swojego przewodnika duchowego / mistrza",
      "znalazła nauczyciela mędrca, który nauczył ją swojej mądrości",
      "dzięki swoim działaniom, sprawiła że wpływowy członek mafii jest winny jej przysługę",
      "zasłynęła w okolicy",
      "nawiązała przyjaźń w gwardii królewskiej",
      "ma dobre stosunki z lokalnym gangiem",
      "znalazła nauczyciela sztuk walki (dowolnych)",
      "uzyskała błogosławieństwo wybranego boga",
    ])

    return `
      Twoją postać spotkało szczęście, \n
      ponieważ ${tab0}.
    `
  }

  const tab0 = generate([
    "zaciągnęła dług, który musi teraz spłacić: pieniędzmi albo krwią",
    "przebywała w więzieniu / była zakładnikiem",
    "uzależniła się od substancji psychoaktywnej. Opanowała nałóg ale nie wpełni",
    () => {return "została zdradzona. " + generate(["Twoja postać była ofiarą szntażu", "Ktoś zdradził twoje sekrety"])},
    () => {return "była ofiarą ciężkiego wypadku. " + generate(["Straciła wiele cennych wspomnień", "Od tego czasu cierpi na zespół stresu pourazowego"])},
    "widziała jak na jej oczach ginie jej ktoś bliski",
    () => {return "została fałszywie oskarżona o " + generate(["kradzież", "gwałt", "rozbój", "tchórzostwo"])},
    () => {return "nabroiła i jest ścigana przez " + generate(["lokalną mafię", "straż miejską", "straż miejską", "straż miejską", "namiestnika króla listem gończym"])},
  ])

  const tab1 = generate([
    "oczyści swoje imię z zarzutów",
    "będzie z tym żyć i zapomni o problemie",
    "znajdzie odpowiedzialnych za pechowy przebieg spaw i rozliczy się z nimi",
    "ocali wszystkich zamieszanych w tę sytuację",
  ])

  return `
    Twoja postać miała pecha, \n
    ponieważ ${tab0}.

    Postanowiła że ${tab1}.
  `
}

const f = () => generate(["abc", "def"])
const root: Table = [
  friendsAndEnemies,
  friendsAndEnemies,
  friendsAndEnemies,
  romance,
  romance,
  romance,
  chances,
  chances,
  chances,
  "Twoja postać miała wyjątkowo spokojny rok.",
]

export function CharacterGenerator({ seq }) {

}