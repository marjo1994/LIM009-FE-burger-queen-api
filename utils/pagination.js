module.exports = (page, limit, number) => {
    const next = `limit=${limit}&page=${limit*page < number ? page+1 :Math.ceil(number / limit)}`;
    const last = `limit=${limit}&page=${Math.ceil(number / limit)}`;
    const first = `limit=${limit}&page=${page > 1 ? 1 : page}`;
    const prev = `limit=${limit}&page=${page  > 1 ? page - 1 : 1}`;
    return `</users?${first}>; rel="first",</users?${prev}>; rel="prev",</users?${next}>; rel="next",</users?${last}>; rel="last"`;
}