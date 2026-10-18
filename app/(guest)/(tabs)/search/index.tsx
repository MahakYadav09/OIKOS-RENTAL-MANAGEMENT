import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RECENT_SEARCHES_KEY = '@recent_searches';

interface RecentSearch {
  id: string;
  location: string;
  dates: string;
  guests: string;
  startDate: string | null;
  endDate: string | null;
  guestCount: number;
  timestamp: number;
}

export default function AirbnbSearchUI() {
  const [activeTab, setActiveTab] = useState('Homes');
  const [expandedSection, setExpandedSection] = useState<string | null>('where');
  const [searchText, setSearchText] = useState('');
  const [selectedDates, setSelectedDates] = useState({ start: null, end: null });
  const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 });
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  const router = useRouter();

  const resetAll = () => {
    setExpandedSection(null);
    setSearchText('');
    setStartDate(null)
    setEndDate(null)
    setSelectedDates({ start: null, end: null });
    setGuests({ adults: 0, children: 0, infants: 0, pets: 0 });
  }

  const handleSectionClick = (section: string | null) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === section ? null : section);
  };

  const updateGuestCount = (type: keyof typeof guests, increment: number) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + increment)
    }));
  };

  // Load recent searches from AsyncStorage
  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        const searches: RecentSearch[] = JSON.parse(saved);
        // Sort by timestamp (most recent first) and limit to 5
        const sortedSearches = searches.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
        setRecentSearches(sortedSearches);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  // Save a new search to AsyncStorage
  const saveSearch = async () => {
    try {
      if (!searchText.trim()) return; // Don't save empty searches

      const totalGuests = guests.adults + guests.children;
      const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      };

      const dateRange = startDate && endDate
        ? `${formatDate(startDate)} – ${formatDate(endDate)}`
        : startDate
          ? formatDate(startDate)
          : 'Anytime';

      const guestsText = totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests';

      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        location: searchText,
        dates: dateRange,
        guests: guestsText,
        startDate: startDate,
        endDate: endDate,
        guestCount: totalGuests,
        timestamp: Date.now()
      };

      // Load existing searches
      const saved = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      let searches: RecentSearch[] = saved ? JSON.parse(saved) : [];

      // Remove duplicate location searches
      searches = searches.filter(s => s.location.toLowerCase() !== searchText.toLowerCase());

      // Add new search at the beginning
      searches.unshift(newSearch);

      // Keep only the 10 most recent searches
      searches = searches.slice(0, 10);

      // Save to AsyncStorage
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));

      // Update state
      setRecentSearches(searches.slice(0, 5));
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  // Delete a specific search
  const deleteSearch = async (id: string) => {
    try {
      const saved = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        let searches: RecentSearch[] = JSON.parse(saved);
        searches = searches.filter(s => s.id !== id);
        await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
        setRecentSearches(searches.slice(0, 5));
      }
    } catch (error) {
      console.error('Error deleting search:', error);
    }
  };

  // Load recent searches on component mount
  useEffect(() => {
    loadRecentSearches();
  }, []);



  // calendar month state (artificial calendar)
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() }; // month 0-11
  });

  const onDayPress = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    if (date < today) return; // don't allow past selection
    if (!startDate || endDate) {
      setStartDate(dateString);
      setEndDate(null);
    } else if (dateString > startDate) {
      setEndDate(dateString);
    } else {
      setStartDate(dateString);
      setEndDate(null);
    }
  };

  // compute marked dates for calendar (period)
  const markedDates = useMemo(() => {
    if (!startDate) return {};
    if (!endDate) {
      return {
        [startDate]: { selected: true, color: '#2563EB' },
      };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const marks: Record<string, any> = {};

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (dateStr === startDate) {
        marks[dateStr] = { startingDay: true, color: '#2563EB' };
      } else if (dateStr === endDate) {
        marks[dateStr] = { endingDay: true, color: '#2563EB' };
      } else {
        marks[dateStr] = { color: '#BEE1FF' };
      }
    }

    return marks;
  }, [startDate, endDate]);

  // nights used for price display
  const nights = useMemo(() => {
    if (!startDate) return 0;
    if (!endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return diff || 1;
  }, [startDate, endDate]);

  // artificial calendar helpers
  const monthName = (y: number, m: number) =>
    new Date(y, m).toLocaleString(undefined, { month: 'long', year: 'numeric' });

  const generateMonthMatrix = (year: number, month: number) => {
    // returns array of weeks, each week is array of Date | null (7 items)
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);
    const firstWeekday = firstOfMonth.getDay(); // 0 Sun - 6 Sat
    const daysInMonth = lastOfMonth.getDate();

    const weeks: (Date | null)[][] = [];
    let week: (Date | null)[] = new Array(7).fill(null);
    let day = 1;

    // fill first week
    for (let i = firstWeekday; i < 7; i++) {
      week[i] = new Date(year, month, day++);
    }
    weeks.push(week);

    while (day <= daysInMonth) {
      week = new Array(7).fill(null);
      for (let i = 0; i < 7 && day <= daysInMonth; i++) {
        week[i] = new Date(year, month, day++);
      }
      weeks.push(week);
    }

    return weeks;
  };

  const monthMatrix = useMemo(
    () => generateMonthMatrix(visibleMonth.year, visibleMonth.month),
    [visibleMonth]
  );

  const isBetween = (dStr: string, s: string | null, e: string | null) => {
    if (!s || !e) return false;
    return dStr > s && dStr < e;
  };

  const goPrev = () => {
    setVisibleMonth((cur) => {
      const m = cur.month - 1;
      if (m < 0) return { year: cur.year - 1, month: 11 };
      return { year: cur.year, month: m };
    });
  };

  const goNext = () => {
    setVisibleMonth((cur) => {
      const m = cur.month + 1;
      if (m > 11) return { year: cur.year + 1, month: 0 };
      return { year: cur.year, month: m };
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={{ fontSize: 18, fontWeight: 600, marginHorizontal: 'auto', marginVertical: 10 }}>Make Your Trip</Text>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Where Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => handleSectionClick('where')}
          >
            <Text style={styles.sectionLabel}>Where</Text>
            <Text style={styles.sectionValue}>I'm flexible</Text>
          </TouchableOpacity>

          {expandedSection === 'where' && (
            <View style={styles.sectionContent}>
              {/* <Text style={styles.sectionTitle}>Where?</Text> */}
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search destinations"
                  placeholderTextColor="#717171"
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>

              <Text style={styles.subsectionTitle}>Recent searches</Text>
              {recentSearches.length === 0 ? (
                <Text style={{ color: '#999', fontSize: 14, marginTop: 8 }}>No recent searches</Text>
              ) : (
                recentSearches.map((search) => (
                  <View key={search.id} style={styles.searchItem}>
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                      onPress={() => {
                        // Populate search fields with saved search
                        setSearchText(search.location);
                        setStartDate(search.startDate);
                        setEndDate(search.endDate);
                        if (search.guestCount > 0) {
                          setGuests({ adults: search.guestCount, children: 0, infants: 0, pets: 0 });
                        }
                      }}
                    >
                      <View style={styles.iconContainer}>
                        <Text style={styles.searchEmoji}>📍</Text>
                      </View>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemTitle}>{search.location}</Text>
                        <Text style={styles.itemSubtitle}>
                          {search.dates} · {search.guests}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteSearch(search.id)}
                      style={styles.deleteButton}
                    >
                      <X size={18} color="#999" />
                    </TouchableOpacity>
                  </View>
                ))
              )}

            </View>
          )}
        </View>

        {/* When Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => handleSectionClick('when')}
          >
            <Text style={styles.sectionLabel}>When</Text>
            <Text style={styles.sectionValue}>Add dates</Text>
          </TouchableOpacity>
          {expandedSection === 'when' && (
            <View style={styles.calendarCard}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={goPrev} style={styles.navBtn}>
                  <Text style={styles.navTxt}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.calendarTitle}>
                  {monthName(visibleMonth.year, visibleMonth.month)}
                </Text>
                <TouchableOpacity onPress={goNext} style={styles.navBtn}>
                  <Text style={styles.navTxt}>›</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.weekRow}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <Text key={d} style={styles.weekDay}>
                    {d}
                  </Text>
                ))}
              </View>

              {monthMatrix.map((week, wi) => (
                <View key={wi} style={styles.weekRow}>
                  {week.map((dt, di) => {
                    if (!dt) return <View key={di} style={styles.dayCell} />;
                    const dateStr = dt.toISOString().split('T')[0];
                    const disabled = dt < today;
                    const isStart = dateStr === startDate;
                    const isEnd = dateStr === endDate;
                    const inRange = isBetween(dateStr, startDate, endDate);
                    return (
                      <TouchableOpacity
                        key={di}
                        style={[
                          styles.dayCell,
                          disabled && styles.dayDisabled,
                          inRange && styles.dayInRange,
                          isStart && styles.dayStart,
                          isEnd && styles.dayEnd,
                        ]}
                        onPress={() => onDayPress(dt)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            disabled && styles.dayTextDisabled,
                            (isStart || isEnd) && styles.dayTextSelected,
                          ]}
                        >
                          {dt.getDate()}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Who Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => handleSectionClick('who')}
          >
            <Text style={styles.sectionLabel}>Who</Text>
            <Text style={styles.sectionValue}>Add guests</Text>
          </TouchableOpacity>

          {expandedSection === 'who' && (
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Who's coming?</Text>

              <View>
                {[
                  { key: 'adults' as const, title: 'Adults', subtitle: 'Ages 13 or above' },
                  { key: 'children' as const, title: 'Children', subtitle: 'Ages 2–12' },
                  { key: 'infants' as const, title: 'Infants', subtitle: 'Under 2' },
                  { key: 'pets' as const, title: 'Pets', subtitle: 'Bringing a service animal?' }
                ].map((guest) => (
                  <View key={guest.key} style={styles.guestRow}>
                    <View style={styles.guestInfo}>
                      <Text style={styles.guestTitle}>{guest.title}</Text>
                      <Text style={styles.guestSubtitle}>{guest.subtitle}</Text>
                    </View>
                    <View style={styles.guestCounter}>
                      <TouchableOpacity
                        style={[
                          styles.counterBtn,
                          guests[guest.key] === 0 && styles.counterBtnDisabled
                        ]}
                        onPress={() => updateGuestCount(guest.key, -1)}
                        disabled={guests[guest.key] === 0}
                      >
                        <Text style={styles.counterBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.counterValue}>{guests[guest.key]}</Text>
                      <TouchableOpacity
                        style={styles.counterBtn}
                        onPress={() => updateGuestCount(guest.key, 1)}
                      >
                        <Text style={styles.counterBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={resetAll}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={async () => {
          const totalGuests = guests.adults + guests.children;

          // Save search to AsyncStorage
          await saveSearch();

          router.push({
            pathname: "/(guest)/(tabs)/search/result",
            params: {
              location: searchText,
              startDate: startDate || '',
              endDate: endDate || '',
              guests: totalGuests.toString()
            }
          });
        }}>
          <Search size={25} color={'white'} />
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F7F7F7',
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  signal: {
    fontSize: 16,
  },
  wifi: {
    fontSize: 16,
  },
  battery: {
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    position: 'relative',
  },
  tab: {
    alignItems: 'center',
    position: 'relative',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    color: '#717171',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -17,
    height: 2,
    width: '100%',
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 3,
  },
  sectionHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  sectionValue: {
    fontSize: 16,
    color: '#717171',
  },
  sectionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 12,
    fontSize: 20,
  },
  searchInput: {
    fontSize: 16,
    width: '100%',
    height: '100%',
    color: '#000',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 15
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    marginTop: 8,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  destinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchEmoji: {
    fontSize: 28,
  },
  destinationIcon: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#717171',
  },
  dateTabs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  dateTab: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 24,
    backgroundColor: '#FFF',
  },
  dateTabActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  dateTabText: {
    fontSize: 14,
    color: '#000',
  },
  dateTabTextActive: {
    color: '#FFF',
  },
  calendarMonth: {
    marginBottom: 32,
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weekday: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    color: '#717171',
    fontWeight: '600',
    paddingVertical: 8,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayActive: {
    borderRadius: 100,
  },
  calendarDayPast: {
    opacity: 0.3,
  },
  calendarDayToday: {
    backgroundColor: '#F7F7F7',
  },
  calendarDayText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  calendarDayTextPast: {
    color: '#DEDEDE',
  },
  calendarDayTextToday: {
    fontWeight: '700',
  },
  dateOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
  dateOption: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 24,
    backgroundColor: '#FFF',
  },
  dateOptionActive: {
    backgroundColor: '#000',
  },
  dateOptionText: {
    fontSize: 14,
    color: '#000',
  },
  dateOptionTextActive: {
    color: '#FFF',
  },
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  guestInfo: {
    flex: 1,
  },
  guestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  guestSubtitle: {
    fontSize: 14,
    color: '#717171',
  },
  guestCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnDisabled: {
    opacity: 0.3,
  },
  counterBtnText: {
    fontSize: 18,
    color: '#000',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '500',
    minWidth: 24,
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  clearText: {
    fontSize: 16,
    color: '#000',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF385C',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchButtonIcon: {
    fontSize: 16,
  },
  searchButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
  },

  /* Calendar styles */
  calendarCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6EEF9',
    width: '95%',
    marginHorizontal: 'auto',
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
  navBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  navTxt: {
    fontSize: 20,
    color: '#2563EB',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  weekDay: {
    width: 36,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 12,
  },
  dayCell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    color: '#111827',
  },
  dayDisabled: {
    opacity: 0.3,
  },
  dayTextDisabled: {
    color: '#9CA3AF',
  },
  dayInRange: {
    backgroundColor: '#BEE1FF',
    borderRadius: 6,
  },
  dayStart: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
  },
  dayEnd: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});