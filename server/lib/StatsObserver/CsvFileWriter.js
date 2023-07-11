const { createWriteStream, existsSync, mkdirSync } = require('fs');

const { join: joinPath } = require('path');

class CsvFileWriter
{
	static create(roomName, transportId)
	{
		return new CsvFileWriter(roomName, transportId);
	}

	constructor(roomName, transportId)
	{
		this._room = roomName;
		this._transportId = transportId;
		const dirname = joinPath(process.cwd(), 'bwe_logs', this._room);

		if (!existsSync(dirname))
		{
			mkdirSync(dirname, { recursive: true });
		}

		this._stream = createWriteStream(joinPath(dirname, `${this._transportId}.csv`));

		this._stream.on('error', (err) =>
		{
			console.error('CsvFileWriter write stream error', err);
		});

		this._stream.on('warning', (err) =>
		{
			console.warn('CsvFileWriter write stream warning', err);
		});

		this._writeHeader();
	}

	_writeHeader()
	{
		this._stream.write(
			[
				'timestamp',
				'estimatedBitrate',
				'delay_slope',
				'delay_rSquared',
				'delay_threshold',
				'delay_rtt',
				'delay_rateControlState',
				'delay_delayDetectorState',
				'alr',
				'probe_estimatedBitrate',
				'loss_inherent',
				'loss_avg',
				'loss_estimatedBitrate',
				'loss_sendingRate',
				'desiredBitrate',
				'effectiveDesiredBitrate',
				'minBitrate',
				'maxBitrate',
				'startBitrate',
				'maxPaddingBitrate',
				'sendingRate',
				'availableOutgoingBitrate',
				'rtpSendingRate',
				'rtxSendingRate'
			].join(',') + '\n'
		);
	}

	logBweStats(trace)
	{
		this._stream.write(
			[
				trace.timestamp,
				trace.info.estimatedBitrate,
				trace.info.delay.slope.toFixed(4),
				trace.info.delay.rSquared.toFixed(2),
				trace.info.delay.threshold.toFixed(4),
				trace.info.delay.rtt,
				trace.info.delay.rateControlState,
				trace.info.delay.delayDetectorState,
				trace.info.alr,
				trace.info.probe.estimatedBitrate,
				trace.info.loss.inherent.toFixed(4),
				trace.info.loss.avg.toFixed(4),
				trace.info.loss.estimatedBitrate,
				trace.info.loss.sendingRate,
				trace.info.desiredBitrate,
				trace.info.effectiveDesiredBitrate,
				trace.info.minBitrate,
				trace.info.maxBitrate,
				trace.info.startBitrate,
				trace.info.maxPaddingBitrate,
				trace.info.sendingRate,
				trace.info.availableOutgoingBitrate,
				trace.info.rtpSendingRate,
				trace.info.rtxSendingRate
			].join(',') + '\n'
		);
	}

	close()
	{
		this._stream.close();
	}
}

module.exports = {
	CsvFileWriter
};