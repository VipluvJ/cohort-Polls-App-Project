class ApiResponse {
  static ok(res, message, data = null) {
    return res.status(200).json({
      success: true,
    });
  }
}
