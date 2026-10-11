import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  WaterBody,
  Aquifer,
  HeatZone,
  Community,
  Activity,
  EnvironmentalReport,
  EducationTopic,
  NotificationItem,
  NavTab,
  MapLayer,
  Observation,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_WATER_BODIES,
  INITIAL_AQUIFERS,
  INITIAL_HEAT_ZONES,
  INITIAL_COMMUNITIES,
  INITIAL_ACTIVITIES,
  INITIAL_REPORTS,
  INITIAL_EDUCATION_TOPICS,
  INITIAL_NOTIFICATIONS,
} from '../data/seedData';
import {
  waterBodiesApi,
  aquifersApi,
  heatZonesApi,
  communitiesApi,
  activitiesApi,
  reportsApi,
  healthApi,
  authApi,
} from '../services/api';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalDefaultMode: 'login' | 'signup';
  openAuthModal: (defaultMode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    email: string;
    password: string;
    name: string;
    city?: string;
    state?: string;
    neighborhood?: string;
    bio?: string;
    role?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  navTab: NavTab;
  setNavTab: (tab: NavTab) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;

  // Environmental Data
  waterBodies: WaterBody[];
  aquifers: Aquifer[];
  heatZones: HeatZone[];
  selectedWaterBodyId: string | null;
  setSelectedWaterBodyId: (id: string | null) => void;
  selectedAquiferId: string | null;
  setSelectedAquiferId: (id: string | null) => void;
  selectedHeatZoneId: string | null;
  setSelectedHeatZoneId: (id: string | null) => void;

  // Map state
  mapLayer: MapLayer;
  setMapLayer: (layer: MapLayer) => void;

  // Communities
  communities: Community[];
  selectedCommunityId: string | null;
  setSelectedCommunityId: (id: string | null) => void;
  joinCommunity: (communityId: string) => void;
  leaveCommunity: (communityId: string) => void;
  createCommunity: (data: Partial<Community>) => Community;
  addCommunityPost: (communityId: string, content: string, photoUrl?: string) => void;
  addPostComment: (communityId: string, postId: string, commentText: string) => void;

  // Activities
  activities: Activity[];
  selectedActivityId: string | null;
  setSelectedActivityId: (id: string | null) => void;
  joinActivity: (activityId: string) => void;
  leaveActivity: (activityId: string) => void;
  createActivity: (data: Partial<Activity>) => Activity;
  completeActivity: (
    activityId: string,
    beforePhoto: string,
    afterPhoto: string,
    description: string,
    impactSummary: string
  ) => void;

  // Reports
  reports: EnvironmentalReport[];
  submitReport: (data: Omit<EnvironmentalReport, 'id' | 'userId' | 'userName' | 'userAvatar' | 'submittedAt' | 'isCitizenReport'>) => EnvironmentalReport;
  updateReportStatus: (reportId: string, status: EnvironmentalReport['status'], note?: string) => void;

  // Education
  educationTopics: EducationTopic[];
  selectedTopicId: string | null;
  setSelectedTopicId: (id: string | null) => void;

  // Observations
  addWaterBodyObservation: (waterBodyId: string, observation: Omit<Observation, 'id' | 'userId' | 'userName' | 'userAvatar' | 'date' | 'isCitizenReport'>) => void;

  // Promotion Modal
  isPromotionModalOpen: boolean;
  promotionTarget: { type: 'activity' | 'community'; item: Activity | Community } | null;
  openPromotionModal: (type: 'activity' | 'community', item: Activity | Community) => void;
  closePromotionModal: () => void;

  // Report Modal
  isReportModalOpen: boolean;
  openReportModal: (preselectedWaterBodyId?: string) => void;
  closeReportModal: () => void;
  preselectedReportWaterBodyId: string | null;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'userId' | 'timestamp' | 'read'>) => void;

  // Search & Navigation helper
  navigateToWaterBody: (waterBodyId: string) => void;
  navigateToCommunity: (communityId: string) => void;
  navigateToActivity: (activityId: string) => void;
  navigateToTopic: (topicId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  WATER_BODIES: 'jal_dharani_water_bodies',
  COMMUNITIES: 'jal_dharani_communities',
  ACTIVITIES: 'jal_dharani_activities',
  REPORTS: 'jal_dharani_reports',
  NOTIFICATIONS: 'jal_dharani_notifications',
  USER: 'jal_dharani_user',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!authApi.getToken();
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalDefaultMode, setAuthModalDefaultMode] = useState<'login' | 'signup'>('login');

  const openAuthModal = (defaultMode: 'login' | 'signup' = 'login') => {
    setAuthModalDefaultMode(defaultMode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    if (res.success && res.data) {
      setCurrentUser(res.data.user);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data.user));
      return { success: true };
    }
    return { success: false, error: res.error || 'Invalid email or password' };
  };

  const signup = async (data: {
    email: string;
    password: string;
    name: string;
    city?: string;
    state?: string;
    neighborhood?: string;
    bio?: string;
    role?: string;
  }) => {
    const res = await authApi.signup(data);
    if (res.success && res.data) {
      setCurrentUser(res.data.user);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data.user));
      return { success: true };
    }
    return { success: false, error: res.error || 'Registration failed' };
  };

  const logout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setCurrentUser(INITIAL_USERS[0]);
    setNavTab('home');
  };

  // Restore authenticated session on initial mount
  useEffect(() => {
    const token = authApi.getToken();
    if (token) {
      authApi.getMe().then((remoteUser) => {
        if (remoteUser) {
          setCurrentUser(remoteUser);
          setIsAuthenticated(true);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(remoteUser));
        } else {
          setIsAuthenticated(false);
        }
      });
    }
  }, []);

  const [navTab, setNavTab] = useState<NavTab>('home');
  const [selectedCity, setSelectedCity] = useState<string>('Pune');

  // Environmental Layers & Entities
  const [waterBodies, setWaterBodies] = useState<WaterBody[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WATER_BODIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_WATER_BODIES;
  });

  const [aquifers, setAquifers] = useState<Aquifer[]>(INITIAL_AQUIFERS);
  const [heatZones, setHeatZones] = useState<HeatZone[]>(INITIAL_HEAT_ZONES);
  const [educationTopics] = useState<EducationTopic[]>(INITIAL_EDUCATION_TOPICS);

  const [mapLayer, setMapLayer] = useState<MapLayer>('surface-water');
  const [selectedWaterBodyId, setSelectedWaterBodyId] = useState<string | null>(null);
  const [selectedAquiferId, setSelectedAquiferId] = useState<string | null>(null);
  const [selectedHeatZoneId, setSelectedHeatZoneId] = useState<string | null>(null);

  // Communities
  const [communities, setCommunities] = useState<Community[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMMUNITIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_COMMUNITIES;
  });
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);

  // Activities
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ACTIVITIES;
  });
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  // Reports
  const [reports, setReports] = useState<EnvironmentalReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REPORTS;
  });

  // Education
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Modals
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [promotionTarget, setPromotionTarget] = useState<{
    type: 'activity' | 'community';
    item: Activity | Community;
  } | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [preselectedReportWaterBodyId, setPreselectedReportWaterBodyId] = useState<string | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATER_BODIES, JSON.stringify(waterBodies));
  }, [waterBodies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(communities));
  }, [communities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Progressive Backend Synchronization: Load live PostGIS data when available
  useEffect(() => {
    let isMounted = true;

    async function syncBackend() {
      try {
        const health = await healthApi.check();
        if (!health || !isMounted) return;

        const [fetchedWb, fetchedAq, fetchedHz, fetchedComm, fetchedAct, fetchedRep] =
          await Promise.all([
            waterBodiesApi.getAll(),
            aquifersApi.getAll(),
            heatZonesApi.getAll(),
            communitiesApi.getAll(),
            activitiesApi.getAll(),
            reportsApi.getAll(),
          ]);

        if (isMounted) {
          if (fetchedWb && fetchedWb.length > 0) setWaterBodies(fetchedWb);
          if (fetchedAq && fetchedAq.length > 0) setAquifers(fetchedAq);
          if (fetchedHz && fetchedHz.length > 0) setHeatZones(fetchedHz);
          if (fetchedComm && fetchedComm.length > 0) setCommunities(fetchedComm);
          if (fetchedAct && fetchedAct.length > 0) setActivities(fetchedAct);
          if (fetchedRep && fetchedRep.length > 0) setReports(fetchedRep);
        }
      } catch (e) {
        // Local fallback is maintained
      }
    }

    syncBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  // Actions
  const joinCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === communityId) {
          const alreadyMember = c.members.some((m) => m.userId === currentUser.id);
          if (alreadyMember) return c;
          const newMember = {
            userId: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            role: 'volunteer' as const,
            joinedAt: new Date().toISOString().split('T')[0],
          };
          return {
            ...c,
            members: [...c.members, newMember],
            impact: {
              ...c.impact,
              membersCount: c.impact.membersCount + 1,
            },
          };
        }
        return c;
      })
    );

    communitiesApi.join(communityId);

    addNotification({
      type: 'member_joined',
      title: 'Joined Community',
      message: `You are now a member of ${communities.find((c) => c.id === communityId)?.name || 'the community'}!`,
      link: 'communities',
    });
  };

  const leaveCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === communityId) {
          return {
            ...c,
            members: c.members.filter((m) => m.userId !== currentUser.id),
            impact: {
              ...c.impact,
              membersCount: Math.max(1, c.impact.membersCount - 1),
            },
          };
        }
        return c;
      })
    );

    communitiesApi.leave(communityId);
  };

  const createCommunity = (data: Partial<Community>): Community => {
    const newComm: Community = {
      id: `comm-${Date.now()}`,
      name: data.name || 'New Conservation Community',
      tagline: data.tagline || 'Citizen water & heat resilience network',
      description: data.description || '',
      focusAreas: data.focusAreas || ['water-body', 'groundwater'],
      location: data.location || {
        city: currentUser.location.city,
        state: currentUser.location.state,
        coordinates: [18.5204, 73.8567],
      },
      waterBodyId: data.waterBodyId,
      adminIds: [currentUser.id],
      members: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          role: 'admin',
          joinedAt: new Date().toISOString().split('T')[0],
        },
      ],
      impact: {
        membersCount: 1,
        activitiesCompleted: 0,
        volunteersMobilized: 1,
        waterBodiesMonitored: data.waterBodyId ? 1 : 0,
        reportsSubmitted: 0,
        rechargeStructuresMapped: 0,
        isVerifiedData: true,
      },
      photos: data.photos || [],
      posts: [],
      announcements: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCommunities((prev) => [newComm, ...prev]);

    communitiesApi.create({
      id: newComm.id,
      name: newComm.name,
      tagline: newComm.tagline,
      description: newComm.description,
      focus_areas: newComm.focusAreas,
      city: newComm.location.city,
      state: newComm.location.state,
      latitude: newComm.location.coordinates[0],
      longitude: newComm.location.coordinates[1],
      water_body_id: newComm.waterBodyId,
      created_by_user_id: currentUser.id,
      photos: newComm.photos,
      announcements: newComm.announcements,
    });

    // Update user stats
    setCurrentUser((prev) => ({
      ...prev,
      impactMetrics: {
        ...prev.impactMetrics,
        activitiesOrganized: prev.impactMetrics.activitiesOrganized + 1,
      },
    }));

    addNotification({
      type: 'community_announcement',
      title: 'Community Created',
      message: `Your community "${newComm.name}" has been launched. Invite neighbors to join!`,
      link: 'communities',
    });

    return newComm;
  };

  const addCommunityPost = (communityId: string, content: string, photoUrl?: string) => {
    const newPost = {
      id: `post-${Date.now()}`,
      communityId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      photoUrl,
      timestamp: new Date().toISOString(),
      likesCount: 0,
      comments: [],
    };

    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === communityId) {
          return {
            ...c,
            posts: [newPost, ...c.posts],
          };
        }
        return c;
      })
    );

    communitiesApi.addPost(communityId, {
      content,
      photo_url: photoUrl,
    });
  };

  const addPostComment = (communityId: string, postId: string, commentText: string) => {
    const newComment = {
      id: `comm-c-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      avatar: currentUser.avatar,
      text: commentText,
      timestamp: new Date().toISOString(),
    };

    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === communityId) {
          return {
            ...c,
            posts: c.posts.map((p) => {
              if (p.id === postId) {
                return {
                  ...p,
                  comments: [...p.comments, newComment],
                };
              }
              return p;
            }),
          };
        }
        return c;
      })
    );

    communitiesApi.addComment(communityId, postId, {
      text: commentText,
    });
  };

  const joinActivity = (activityId: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          const alreadyIn = act.participants.some((p) => p.userId === currentUser.id);
          if (alreadyIn) return act;
          return {
            ...act,
            participants: [
              ...act.participants,
              {
                userId: currentUser.id,
                name: currentUser.name,
                avatar: currentUser.avatar,
                joinedAt: new Date().toISOString().split('T')[0],
              },
            ],
          };
        }
        return act;
      })
    );

    activitiesApi.join(activityId);

    setCurrentUser((prev) => ({
      ...prev,
      impactMetrics: {
        ...prev.impactMetrics,
        activitiesJoined: prev.impactMetrics.activitiesJoined + 1,
        volunteerHours: prev.impactMetrics.volunteerHours + 3,
      },
    }));

    addNotification({
      type: 'activity_reminder',
      title: 'Joined Activity',
      message: `You are signed up for "${activities.find((a) => a.id === activityId)?.title}". See you there!`,
      link: 'activities',
    });
  };

  const leaveActivity = (activityId: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          return {
            ...act,
            participants: act.participants.filter((p) => p.userId !== currentUser.id),
          };
        }
        return act;
      })
    );

    activitiesApi.leave(activityId);

    setCurrentUser((prev) => ({
      ...prev,
      impactMetrics: {
        ...prev.impactMetrics,
        activitiesJoined: Math.max(0, prev.impactMetrics.activitiesJoined - 1),
      },
    }));
  };

  const createActivity = (data: Partial<Activity>): Activity => {
    const parentComm = communities.find((c) => c.id === data.communityId) || communities[0];
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      communityId: parentComm.id,
      communityName: parentComm.name,
      title: data.title || 'Community Water Action',
      description: data.description || '',
      category: data.category || 'cleanup',
      location: data.location || {
        name: 'Community Site',
        address: `${currentUser.location.city}, ${currentUser.location.state}`,
        coordinates: [18.5204, 73.8567],
      },
      date: data.date || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      time: data.time || '08:00 AM – 11:00 AM IST',
      organizer: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      volunteerLimit: data.volunteerLimit || 30,
      participants: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          joinedAt: new Date().toISOString().split('T')[0],
        },
      ],
      status: 'upcoming',
      waterBodyId: data.waterBodyId,
      photos: data.photos || [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setActivities((prev) => [newAct, ...prev]);

    activitiesApi.create({
      id: newAct.id,
      community_id: parentComm.id,
      water_body_id: newAct.waterBodyId,
      title: newAct.title,
      description: newAct.description,
      category: newAct.category,
      location_name: newAct.location.name,
      location_address: newAct.location.address,
      latitude: newAct.location.coordinates[0],
      longitude: newAct.location.coordinates[1],
      date: newAct.date,
      time: newAct.time,
      organizer_id: currentUser.id,
      organizer_name: currentUser.name,
      organizer_avatar: currentUser.avatar,
      volunteer_limit: newAct.volunteerLimit,
      status: 'upcoming',
      photos: newAct.photos,
    });

    // Update community activities count
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === parentComm.id) {
          return {
            ...c,
            impact: {
              ...c.impact,
              volunteersMobilized: c.impact.volunteersMobilized + 1,
            },
          };
        }
        return c;
      })
    );

    addNotification({
      type: 'activity_invite',
      title: 'Activity Scheduled',
      message: `"${newAct.title}" has been published. Share it with your community!`,
      link: 'activities',
    });

    return newAct;
  };

  const completeActivity = (
    activityId: string,
    beforePhoto: string,
    afterPhoto: string,
    description: string,
    impactSummary: string
  ) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          return {
            ...act,
            status: 'completed',
            beforeAfter: {
              beforePhoto,
              afterPhoto,
              description,
              impactSummary,
            },
          };
        }
        return act;
      })
    );

    const act = activities.find((a) => a.id === activityId);
    if (act) {
      setCommunities((prev) =>
        prev.map((c) => {
          if (c.id === act.communityId) {
            return {
              ...c,
              impact: {
                ...c.impact,
                activitiesCompleted: c.impact.activitiesCompleted + 1,
              },
            };
          }
          return c;
        })
      );

      activitiesApi.recordImpact(activityId, {
        before_photo: beforePhoto,
        after_photo: afterPhoto,
        description,
        impact_summary: impactSummary,
        volunteers_attended: act.participants.length,
      });
    }

    addNotification({
      type: 'community_announcement',
      title: 'Activity Documented',
      message: `Impact documented for "${act?.title || 'Activity'}". Before/after results are now public!`,
      link: 'activities',
    });
  };

  const submitReport = (
    data: Omit<EnvironmentalReport, 'id' | 'userId' | 'userName' | 'userAvatar' | 'submittedAt' | 'isCitizenReport'>
  ): EnvironmentalReport => {
    const newReport: EnvironmentalReport = {
      id: `rep-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      title: data.title,
      category: data.category,
      description: data.description,
      location: data.location,
      waterBodyId: data.waterBodyId,
      waterBodyName: data.waterBodyName,
      photoUrl: data.photoUrl,
      status: 'SUBMITTED',
      statusNote: 'Citizen observation submitted. Ground community will review soon.',
      submittedAt: new Date().toISOString(),
      isCitizenReport: true,
    };

    setReports((prev) => [newReport, ...prev]);

    reportsApi.create({
      id: newReport.id,
      title: newReport.title,
      category: newReport.category,
      description: newReport.description,
      location_name: newReport.location.name,
      city: newReport.location.city,
      state: newReport.location.state,
      latitude: newReport.location.coordinates[0],
      longitude: newReport.location.coordinates[1],
      water_body_id: newReport.waterBodyId,
      submitted_by_user_id: newReport.userId,
      submitted_by_user_name: newReport.userName,
      submitted_by_user_avatar: newReport.userAvatar,
      photo_url: newReport.photoUrl,
      status: 'SUBMITTED',
      status_note: newReport.statusNote,
    });

    // If water body associated, update water body report count
    if (data.waterBodyId) {
      setWaterBodies((prev) =>
        prev.map((wb) => {
          if (wb.id === data.waterBodyId) {
            return {
              ...wb,
              reportCount: wb.reportCount + 1,
            };
          }
          return wb;
        })
      );
    }

    setCurrentUser((prev) => ({
      ...prev,
      impactMetrics: {
        ...prev.impactMetrics,
        reportsSubmitted: prev.impactMetrics.reportsSubmitted + 1,
      },
    }));

    addNotification({
      type: 'report_status',
      title: 'Report Submitted',
      message: `Your observation "${newReport.title}" has been registered. Thank you for citizen vigilance!`,
      link: 'reports',
    });

    return newReport;
  };

  const updateReportStatus = (reportId: string, status: EnvironmentalReport['status'], note?: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status,
            statusNote: note || r.statusNote,
          };
        }
        return r;
      })
    );

    reportsApi.updateStatus(reportId, status, note);
  };

  const addWaterBodyObservation = (
    waterBodyId: string,
    obs: Omit<Observation, 'id' | 'userId' | 'userName' | 'userAvatar' | 'date' | 'isCitizenReport'>
  ) => {
    const newObservation: Observation = {
      id: `obs-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      date: new Date().toISOString().split('T')[0],
      note: obs.note,
      photoUrl: obs.photoUrl,
      category: obs.category,
      isCitizenReport: true,
    };

    setWaterBodies((prev) =>
      prev.map((wb) => {
        if (wb.id === waterBodyId) {
          return {
            ...wb,
            observations: [newObservation, ...wb.observations],
          };
        }
        return wb;
      })
    );

    waterBodiesApi.addObservation(waterBodyId, {
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_avatar: currentUser.avatar,
      category: obs.category,
      note: obs.note,
      photo_url: obs.photoUrl,
    });

    addNotification({
      type: 'report_status',
      title: 'Observation Added',
      message: `Your field observation has been attached to the water body record.`,
      link: 'maps',
    });
  };

  const openPromotionModal = (type: 'activity' | 'community', item: Activity | Community) => {
    setPromotionTarget({ type, item });
    setIsPromotionModalOpen(true);
  };

  const closePromotionModal = () => {
    setIsPromotionModalOpen(false);
    setPromotionTarget(null);
  };

  const openReportModal = (preselectedWaterBodyId?: string) => {
    setPreselectedReportWaterBodyId(preselectedWaterBodyId || null);
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setPreselectedReportWaterBodyId(null);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'userId' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      ...item,
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const navigateToWaterBody = (waterBodyId: string) => {
    setSelectedWaterBodyId(waterBodyId);
    setNavTab('maps');
  };

  const navigateToCommunity = (communityId: string) => {
    setSelectedCommunityId(communityId);
    setNavTab('communities');
  };

  const navigateToActivity = (activityId: string) => {
    setSelectedActivityId(activityId);
    setNavTab('activities');
  };

  const navigateToTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setNavTab('education');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users: INITIAL_USERS,
        isAuthenticated,
        isAuthModalOpen,
        authModalDefaultMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        navTab,
        setNavTab,
        selectedCity,
        setSelectedCity,
        waterBodies,
        aquifers,
        heatZones,
        selectedWaterBodyId,
        setSelectedWaterBodyId,
        selectedAquiferId,
        setSelectedAquiferId,
        selectedHeatZoneId,
        setSelectedHeatZoneId,
        mapLayer,
        setMapLayer,
        communities,
        selectedCommunityId,
        setSelectedCommunityId,
        joinCommunity,
        leaveCommunity,
        createCommunity,
        addCommunityPost,
        addPostComment,
        activities,
        selectedActivityId,
        setSelectedActivityId,
        joinActivity,
        leaveActivity,
        createActivity,
        completeActivity,
        reports,
        submitReport,
        updateReportStatus,
        educationTopics,
        selectedTopicId,
        setSelectedTopicId,
        addWaterBodyObservation,
        isPromotionModalOpen,
        promotionTarget,
        openPromotionModal,
        closePromotionModal,
        isReportModalOpen,
        openReportModal,
        closeReportModal,
        preselectedReportWaterBodyId,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        navigateToWaterBody,
        navigateToCommunity,
        navigateToActivity,
        navigateToTopic,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
