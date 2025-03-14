/**
 * Format response untuk menjaga konsistensi response API
 * @param {Boolean} success - Status response
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Pesan response
 * @param {Object} data - Data yang akan dikembalikan
 * @returns {Object} Response object
 */
exports.formatResponse = (success, statusCode, message, data = null) => {
  const response = {
    success,
    message,
  };

  if (data) {
    response.data = data;
  }

  return { statusCode, response };
};

/**
 * Validasi input untuk mencegah error
 * @param {Object} body - Request body
 * @param {Array} requiredFields - Array field yang wajib ada
 * @returns {Object} Hasil validasi
 */
exports.validateInput = (body, requiredFields) => {
  const errors = [];

  requiredFields.forEach((field) => {
    if (!body[field]) {
      errors.push(`${field} wajib diisi`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Pagination helper
 * @param {Number} page - Halaman yang diminta
 * @param {Number} limit - Jumlah item per halaman
 * @param {Number} total - Total jumlah item
 * @returns {Object} Informasi pagination
 */
exports.getPagination = (page = 1, limit = 10, total) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  pagination.total = total;
  pagination.totalPages = Math.ceil(total / limit);
  pagination.currentPage = page;
  pagination.limit = limit;

  return {
    pagination,
    startIndex,
    endIndex,
  };
};
