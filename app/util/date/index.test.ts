import {
  msBetweenDates,
  msToHours,
  toDateFormat,
  formatTimestampToYYYYMMDD,
  getTimeDifferenceFromNow,
} from '.';

const TZ = 'America/Toronto';

describe('Date', () => {
  describe('toDateFormat', () => {
    it('should be America/Toronto timeZone', () => {
      // we're explicitly setting TZ in `jest.config.js`
      // this test is to verify that
      expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe(TZ);
    });
    it('should format date correctly', () => {
      // if TZ is not 'America/Toronto' the following test cases will fail
      expect(toDateFormat(1592877684000)).toBe('Jun 22 at 10:01 pm');
      expect(toDateFormat(1592877340000)).toBe('Jun 22 at 9:55 pm');
      expect(toDateFormat(1592850067000)).toBe('Jun 22 at 2:21 pm');
      expect(toDateFormat(1615308615000)).toBe('Mar 9 at 11:50 am');
      expect(toDateFormat(1615308108000)).toBe('Mar 9 at 11:41 am');
      // this was previously rendering as 0:28 pm:
      expect(toDateFormat(1615912139000)).toBe('Mar 16 at 12:28 pm');
      expect(toDateFormat(1592883929000)).toBe('Jun 22 at 11:45 pm');
      expect(toDateFormat(1592883518000)).toBe('Jun 22 at 11:38 pm');
      expect(toDateFormat(1592882817000)).toBe('Jun 22 at 11:26 pm');
      expect(toDateFormat(1592881746000)).toBe('Jun 22 at 11:09 pm');
      expect(toDateFormat(1592879617000)).toBe('Jun 22 at 10:33 pm');
      expect(toDateFormat(1592879267000)).toBe('Jun 22 at 10:27 pm');
      expect(toDateFormat(1592879146000)).toBe('Jun 22 at 10:25 pm');
      expect(toDateFormat(1592878450000)).toBe('Jun 22 at 10:14 pm');
    });
  });
});

describe('Date util :: msBetweenDates', () => {
  it('should return 1000', () => {
    const DateReal = global.Date;

    const mockDate = new Date();
    const spy = jest
      .spyOn(global, 'Date')
      .mockImplementation(function (
        ...args: ConstructorParameters<typeof DateReal>
      ) {
        if (args.length) {
          return new DateReal(...args);
        }
        return mockDate;
        // TODO: Replace "any" with type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

    const todayOneHourEarlier = new Date().getTime() - 1000;
    const dateOneHourEarlier = new Date(todayOneHourEarlier);

    expect(msBetweenDates(dateOneHourEarlier)).toEqual(1000);
    spy.mockClear();
  });
});

describe('Date util :: msToHours', () => {
  it('should return 1', () => {
    expect(msToHours(1000 * 60 * 60)).toEqual(1);
  });
});

describe('Date util :: formatTimestampToYYYYMMDD', () => {
  it('should format timestamp', () => {
    const testTimestamp = 1722432060;
    const date = new Date(testTimestamp * 1000).getTime();
    expect(formatTimestampToYYYYMMDD(date)).toEqual('2024-07-31');
  });
});

describe('Date util :: getDaysAndHoursRemaining', () => {
  // 2024-09-24 19:19:41
  const MOCK_NOW = 1727205581107;

  const mockDateNow = jest.spyOn(Date, 'now');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.spyOn(Date, 'now').mockRestore();
  });

  it('returns time difference between timestamp and now', () => {
    mockDateNow.mockImplementation(() => MOCK_NOW);

    // 2024-09-29 23:54:41 (5 days, 4 hours, and 35 minutes after MOCK_NOW)
    const TIMESTAMP = 1727654081107;

    const { days, hours, minutes } = getTimeDifferenceFromNow(
      Number(TIMESTAMP),
    );

    expect(days).toBe(5);
    expect(hours).toBe(4);
    expect(minutes).toBe(35);
  });

  it('returns correct value when timestamp and current time are identical', () => {
    mockDateNow.mockImplementation(() => MOCK_NOW);

    const { days, hours, minutes } = getTimeDifferenceFromNow(Number(MOCK_NOW));

    expect(days).toBe(0);
    expect(hours).toBe(0);
    expect(minutes).toBe(0);
  });

  it('returns default value when timestamp passed in is in the past', () => {
    // 2024-09-21 19:19:41 (3 days before MOCK_NOW)
    const TIMESTAMP = 1726946381107;

    mockDateNow.mockImplementation(() => MOCK_NOW);

    const { days, hours, minutes } = getTimeDifferenceFromNow(
      Number(TIMESTAMP),
    );

    expect(days).toBe(0);
    expect(hours).toBe(0);
    expect(minutes).toBe(0);
  });
});
