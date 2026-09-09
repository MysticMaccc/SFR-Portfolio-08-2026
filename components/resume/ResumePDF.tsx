import {
  Document, Page, Text, View, StyleSheet, Link,
} from '@react-pdf/renderer';
import type { PortfolioData } from '@/types';

const colors = {
  primary: '#007AFF',
  dark: '#1C1C1E',
  secondary: '#636366',
  light: '#F2F2F7',
  white: '#FFFFFF',
  border: '#E5E5EA',
};

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: colors.white, paddingHorizontal: 40, paddingVertical: 35 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 16, borderBottomColor: colors.border, borderBottomWidth: 1.5 },
  name: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: colors.dark, letterSpacing: -0.5 },
  title: { fontSize: 11, color: colors.primary, fontFamily: 'Helvetica-Bold', marginTop: 2 },
  contactItem: { fontSize: 8.5, color: colors.secondary, marginBottom: 2 },
  sectionTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: colors.primary, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6, marginTop: 14 },
  sectionLine: { height: 1, backgroundColor: colors.border, marginBottom: 8 },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  expRole: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: colors.dark },
  expDate: { fontSize: 8.5, color: colors.secondary },
  expCompany: { fontSize: 9, color: colors.primary, marginBottom: 3 },
  bullet: { flexDirection: 'row', marginBottom: 2 },
  bulletDot: { fontSize: 8.5, color: colors.secondary, marginRight: 5, marginTop: 1 },
  bulletText: { fontSize: 8.5, color: colors.secondary, flex: 1, lineHeight: 1.4 },
  skillCategory: { marginBottom: 6 },
  skillCategoryLabel: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: colors.dark, marginBottom: 2 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  skillPill: { backgroundColor: colors.light, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  skillText: { fontSize: 7.5, color: colors.secondary },
  projectItem: { marginBottom: 6 },
  projectTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: colors.dark },
  projectDesc: { fontSize: 8, color: colors.secondary, lineHeight: 1.4 },
  trainingRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  trainingTitle: { fontSize: 8.5, color: colors.dark },
  trainingProvider: { fontSize: 8, color: colors.primary },
  trainingYear: { fontSize: 8, color: colors.secondary },
  grid: { flexDirection: 'row', gap: 16 },
  col1: { flex: 1.6 },
  col2: { flex: 1 },
});

export default function ResumePDF({ data }: { data: PortfolioData }) {
  const { profile, experiences, skills, projects, trainings } = data;
  const featured = projects.filter(p => p.featured).slice(0, 5);
  const allProjects = featured.length ? featured : projects.slice(0, 5);

  const grouped = skills.reduce<Record<string, string[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s.name);
    return acc;
  }, {});

  const topCategories = Object.entries(grouped).slice(0, 8);

  return (
    <Document title={`${profile?.name ?? 'Denis Hain'} - Resume`} author={profile?.name ?? 'Denis Hain'}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{profile?.name ?? 'Denis Hain'}</Text>
            <Text style={styles.title}>{profile?.title ?? 'Full Stack Developer'}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            {profile?.email && <Text style={styles.contactItem}>{profile.email}</Text>}
            {profile?.phone && <Text style={styles.contactItem}>{profile.phone}</Text>}
            {profile?.github && (
              <Link src={profile.github} style={{ ...styles.contactItem, color: colors.primary }}>
                {profile.github.replace('https://', '')}
              </Link>
            )}
            {profile?.portfolio_url && (
              <Link src={profile.portfolio_url} style={{ ...styles.contactItem, color: colors.primary }}>
                {profile.portfolio_url.replace('https://', '')}
              </Link>
            )}
          </View>
        </View>

        {/* Bio */}
        {profile?.bio && (
          <View>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <View style={styles.sectionLine} />
            <Text style={{ fontSize: 8.5, color: colors.secondary, lineHeight: 1.5, marginBottom: 4 }}>
              {profile.bio}
            </Text>
          </View>
        )}

        {/* Two column layout */}
        <View style={styles.grid}>
          {/* Left column — Experience + Projects */}
          <View style={styles.col1}>
            {/* Experience */}
            <Text style={styles.sectionTitle}>Work Experience</Text>
            <View style={styles.sectionLine} />
            {experiences.map(exp => (
              <View key={exp.id} style={{ marginBottom: 8 }}>
                <View style={styles.expHeader}>
                  <Text style={styles.expRole}>{exp.role}</Text>
                  <Text style={styles.expDate}>{exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}</Text>
                </View>
                <Text style={styles.expCompany}>{exp.company}</Text>
                {exp.description.slice(0, 4).map((d, i) => (
                  <View key={i} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{d}</Text>
                  </View>
                ))}
              </View>
            ))}

            {/* Selected Projects */}
            <Text style={styles.sectionTitle}>Selected Projects</Text>
            <View style={styles.sectionLine} />
            {allProjects.map(p => (
              <View key={p.id} style={styles.projectItem}>
                <Text style={styles.projectTitle}>{p.title}</Text>
                <Text style={styles.projectDesc}>{p.description}</Text>
                <Text style={{ ...styles.projectDesc, color: colors.primary, marginTop: 1 }}>
                  {p.tech_stack.join(' · ')}
                </Text>
              </View>
            ))}
          </View>

          {/* Right column — Skills + Training */}
          <View style={styles.col2}>
            {/* Skills */}
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <View style={styles.sectionLine} />
            {topCategories.map(([cat, skillNames]) => (
              <View key={cat} style={styles.skillCategory}>
                <Text style={styles.skillCategoryLabel}>{cat}</Text>
                <View style={styles.skillsRow}>
                  {skillNames.map(name => (
                    <View key={name} style={styles.skillPill}>
                      <Text style={styles.skillText}>{name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}

            {/* Training */}
            <Text style={{ ...styles.sectionTitle, marginTop: 12 }}>Certifications</Text>
            <View style={styles.sectionLine} />
            {trainings.map(t => (
              <View key={t.id} style={{ marginBottom: 4 }}>
                <Text style={styles.trainingTitle}>{t.title}</Text>
                <View style={styles.trainingRow}>
                  <Text style={styles.trainingProvider}>{t.provider}</Text>
                  {t.year && <Text style={styles.trainingYear}>{t.year}</Text>}
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
