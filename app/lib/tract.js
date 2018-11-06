/**
 * 追踪用户提交
 * @param {*} name
 * @param {*} question
 */
export function tract_submit(name, question){
  gtag('event', 'submit', {
    'event_category': 'answer',
    'event_label': name + '-' + question,
    'value': 1
  })
}

gtag('event', 'core-bussiness', {
  'event_category' : 'toudi',
  'event_label': 'view',
  'value' : 1
})

gtag('event', 'core-bussiness', {
  'event_category' : 'toudi',
  'event_label': 'submit',
  'value' : 10
})



/**
 * 追踪用户看题
 * @param {*} name
 * @param {*} question
 */
export function tract_view_paper(name){
  gtag('event', 'view', {
    'event_category': 'view-paper',
    'event_label': name,
    'value': 1
  })
}

/**
 * 追踪用户注册
 * @param {*} email
 */
export function tract_register() {
  gtag('event', 'submit', {
    'event_category': 'register',
    'event_label': 'user',
    'value': 1
  })
}
