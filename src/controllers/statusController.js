const db = require('../models');

exports.getStatus = async (req, res, next) => {
    try {
        const request = await db.Request.findByPk(req.params.requestId, { include: [{ all: true }] });
        if (!request) return res.status(404).json({ error: 'Request not found' });
        res.json(request);
    } catch (error) {
        next(error);
    }
};
