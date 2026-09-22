/* Pure game data and classification, shared by browser code and checks. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GameLogic = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const samples = [
    {gems: [['cuore','rosso'],['bastoncino','verde']], answer:'A'},
    {gems: [['quadrato','arancione'],['ottagono','viola']], answer:'B'},
    {gems: [['cuore','verde'],['quadrato','rosa'],['bastoncino','arancione']], answer:'A'},
    {gems: [['bastoncino','rosso'],['quadrato','arancione']], answer:'B', trap:true},
    {gems: [['ottagono','verde'],['quadrato','viola'],['bastoncino','rosa']], answer:'B'},
    {gems: [['cuore','viola']], answer:'A'},
    {gems: [['quadrato','rosso'],['bastoncino','verde']], answer:'B', trap:true},
    {gems: [['cuore','arancione'],['ottagono','viola']], answer:'A'}
  ];
  const referenceA = [samples[0].gems, [['cuore','verde'],['quadrato','rosa']]];
  const referenceB = [samples[1].gems, [['bastoncino','rosso'],['quadrato','verde']]];
  const example = (id,size,shape,dots,label) => ({id,size,shape,dots,label});
  const baseExamples = [example('E1',.18,0,2,'A'),example('E2',.22,0,3,'A'),example('E3',.26,0,2,'A'),example('E4',.78,1,7,'B'),example('E5',.82,1,8,'B'),example('E6',.86,1,7,'B')];
  const extraExamples = [example('E7',.16,0,6,'B'),example('E8',.25,0,8,'B'),example('E9',.30,0,6,'B'),example('E10',.74,1,2,'A'),example('E11',.83,1,3,'A'),example('E12',.88,1,2,'A')];
  const missions = [
    {size:.24,shape:0,dots:3,answer:'A'},
    {size:.84,shape:1,dots:8,answer:'B'},
    {size:.21,shape:0,dots:7,answer:'B'},
    {size:.80,shape:1,dots:3,answer:'A'},
    {size:.50,shape:.5,dots:4,answer:'?'}
  ];
  function features(cell) { return [cell.size, cell.shape, (cell.dots - 2) / 6]; }
  // Only the three features and labeled training examples enter this model.
  // Quiz answers are never consulted, including after adding the new examples.
  function predictCell({size,shape,dots}, examples, k = 3) {
    if (!Number.isInteger(k) || k < 1 || examples.length < k || ![size,shape,dots].every(Number.isFinite)) throw new Error('Indizi o esempi non validi');
    const query = features({size,shape,dots});
    const ranked = examples.map(cell => ({...cell, distance:Math.sqrt(features(cell).reduce((sum,value,i) => sum + (value-query[i]) ** 2,0))}));
    ranked.sort((a,b) => a.distance-b.distance || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    const nearest = ranked.slice(0,k);
    const votes = {A:0,B:0};
    nearest.forEach(cell => { if (!(cell.label in votes)) throw new Error('Etichetta non valida'); votes[cell.label]++; });
    const prediction = votes.A >= votes.B ? 'A' : 'B';
    return {prediction,nearest,votes,agreement:Math.max(votes.A,votes.B),unfamiliar:ranked[0].distance>.45,distance:ranked[0].distance};
  }
  function cellWords(cell) {
    return [cell.size < .4 ? 'Piccola' : cell.size > .6 ? 'Grande' : 'Media', cell.shape < .25 ? 'Tonda' : cell.shape > .75 ? 'Allungata' : 'Ovale', cell.dots <= 3 ? `Pochi puntini: ${cell.dots}` : cell.dots >= 6 ? `Tanti puntini: ${cell.dots}` : `${cell.dots} puntini`];
  }
  function gemScore(answers) {
    return {correct: samples.filter((sample,i) => answers[i] === sample.answer).length, answered:answers.filter(value => value === 'A' || value === 'B').length, total:samples.length};
  }
  return {samples,referenceA,referenceB,baseExamples,extraExamples,missions,predictCell,cellWords,gemScore};
});
