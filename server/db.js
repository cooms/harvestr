var development = require('../knexfile').development
var knex = require('knex')(development)

module.exports = {
  getDonors: getDonors,
  getRecipients: getRecipients,
  getDonor: getDonor,
  getRecipient: getRecipient,
  updateTicket: updateTicket,
  updateComment: updateComment,
  getTickets: getTickets,
  addTicket: addTicket,
  getDonorTicket: getDonorTicket,
  getRecipientTicket: getRecipientTicket
}

// gets list of all donors
function getDonors () {
  return knex('donors').select()
}

// gets list of all recipients
function getRecipients () {
  return knex('recipients').select()
}

//gets details of donors
function getDonor (id) {
  return knex('donors')
  .join('details', 'donors.detail_id', '=', 'details.id')
  .where('donors.id', id)
  .select('donors.name as name', 'details.address as address', 'details.contact_person as contact', 'details.phone as phone', 'details.notes as notes')
}

//gets details of recipients
function getRecipient (id) {
  return knex('recipients')
  .join('details', 'recipients.detail_id', '=', 'details.id')
  .where('recipients.id', id)
  .select('recipients.name as name', 'details.address as address', 'details.contact_person as contact', 'details.phone as phone', 'details.notes as notes')
}

//Ops updates ticket
function updateTicket (ticket) {
  return knex ('tickets')
 .where('tickets.id', ticket.id)
 .update({
   actual_kg: ticket.actualKg,
   is_complete: true
 })
}

//driver updates comments
function updateComment (comment) {
  return knex ('comments')
  .insert({
    ticket_id: comment.ticketId,
    comments: comment.comment
  })
}

function getTickets () {
  return knex('tickets')
    .leftJoin('donors', 'tickets.donor_id', 'donors.id')
    .leftJoin('recipients', 'tickets.recipient_id', 'recipients.id')
    .leftJoin('details', function () {
      this
        .on('details.id', '=', 'donors.detail_id')
        .orOn('details.id', '=', 'recipients.detail_id')
    })
    .select('tickets.id as ticketId', 'donors.name as donorName', 'donors.id as donorId', 'recipients.name as recipientName', 'recipients.id as recipientId', 'expected_kg as expectedKg', 'details.address as address', 'is_complete as isComplete')
  }

//Ops adds a new ticket
function addTicket (ticket) {
  return knex('tickets').insert(ticket)
}

function getDonorTicket (ticketId) {
  return knex ('tickets')
 .join ('donors', 'tickets.donor_id', '=', 'donors.id')
 .join ('details', 'tickets.details_id', '=', 'details.id')
 .join ('comments', 'tickets.comment_id', '=', 'comments.id')
 .where ('tickets.id', ticketId)
 .select ('tickets.id as id', 'tickets.expected_kg as expected', 'donors.name as name', 'details.address as address', 'details.contact_person as contact', 'details.phone as phone', 'details.notes as notes', 'comments.comments as comments', 'tickets.is_complete as isComplete')
}

function getRecipientTicket (ticketId) {
  return knex ('tickets')
  .join ('recipients', 'tickets.recipient_id', '=', 'recipients.id')
  .join ('details', 'tickets.details_id', '=', 'details.id')
  .join ('comments', 'tickets.comment_id', '=', 'comments.id')
  .where ('tickets.id', ticketId)
  .select ('tickets.id as id','tickets.expected_kg as expected', 'recipients.name as name', 'details.address as address', 'details.contact_person as contact', 'details.phone as phone', 'details.notes as notes', 'comments.comments as comments')
}
