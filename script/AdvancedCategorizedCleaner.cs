using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections.Generic;

public class AdvancedCategorizedCleaner : EditorWindow
{
    public enum ScanMode
    {
        LevelSpiel_Hybrid,
        OpenWorld_ReinStatisch
    }

    private ScanMode currentScanMode = ScanMode.LevelSpiel_Hybrid;

    private List<string> unusedTextures = new List<string>();
    private List<string> unusedMaterials = new List<string>();
    private List<string> unusedAudio = new List<string>();
    private List<string> unusedPrefabs = new List<string>();
    private List<string> unusedModels = new List<string>();
    private List<string> unusedAnimations = new List<string>();
    private List<string> unusedFonts = new List<string>();
    private List<string> unusedMisc = new List<string>();

    private string targetFolder = "Assets";
    private string backupFolder = "AssetCleaner_Release_Backup";
    private int currentTab = 0;
    private Vector2 scrollPos;

    [MenuItem("Tools/Release Asset Cleaner")]
    public static void ShowWindow() => GetWindow<AdvancedCategorizedCleaner>("Release Cleaner");

    void OnGUI()
    {
        GUILayout.Label("Projekt-Bereinigung für den Release (Universelle Version)", EditorStyles.boldLabel);
        targetFolder = EditorGUILayout.TextField("Suchbereich Ordner:", targetFolder);

        GUILayout.Space(5);
        currentScanMode = (ScanMode)EditorGUILayout.EnumPopup("Scan-Modus:", currentScanMode);

        GUILayout.Space(10);

        if (currentScanMode == ScanMode.LevelSpiel_Hybrid)
        {
            string logFilePath = Path.Combine(Application.dataPath, "ComprehensiveUsedAssetsLog.txt");
            if (File.Exists(logFilePath))
            {
                EditorGUILayout.HelpBox("✅ Spieldurchlauf-Log wurde gefunden! Die Daten aus dem RAM fließen in die Analyse ein.", MessageType.Info);
            }
            else
            {
                EditorGUILayout.HelpBox("⏳ Bereit für neuen Durchlauf. Klicke erst auf den Reiter 'Reset', spiele das Level im Play-Modus durch und scanne dann.", MessageType.Warning);
            }
        }
        else
        {
            EditorGUILayout.HelpBox("🌍 Open-World-Modus aktiv: Das Spieldurchlauf-Log wird ignoriert. Es werden ALLE Assets gescannt, die fest in den Szenen, Resources- oder Addressables-Ordnern verbaut sind.", MessageType.Info);
        }

        GUILayout.Space(10);

        GUILayout.BeginHorizontal();
        GUI.backgroundColor = new Color(0.3f, 0.8f, 0.4f);
        if (GUILayout.Button("Deep-Dive Analyse starten", GUILayout.Height(30)))
        {
            AnalyzeProjectWithProgress();
        }

        GUI.backgroundColor = new Color(0.8f, 0.4f, 0.4f);
        if (GUILayout.Button("RÜCKGÄNGIG: Backup", GUILayout.Height(30)))
        {
            RestoreBackup();
        }
        GUI.backgroundColor = Color.white;
        GUILayout.EndHorizontal();

        GUILayout.Space(15);
        GUILayout.Box("", GUILayout.ExpandWidth(true), GUILayout.Height(2));
        GUILayout.Space(5);

        string[] tabs = { "Alles", "Texturen", "Materialien", "Audio", "Prefabs", "3D-Modelle", "Animationen", "Fonts", "Sonstiges", "Reset" };
        currentTab = GUILayout.Toolbar(currentTab, tabs);

        GUILayout.Space(10);

        if (currentTab == 0)
        {
            int totalCount = unusedTextures.Count + unusedMaterials.Count + unusedAudio.Count +
                             unusedPrefabs.Count + unusedModels.Count + unusedAnimations.Count +
                             unusedFonts.Count + unusedMisc.Count;

            GUILayout.Label("Gesamtübersicht der Bereinigung", EditorStyles.boldLabel);
            EditorGUILayout.HelpBox($"Insgesamt wurden {totalCount} ungenutzte Elemente in deinem Projekt gefunden.", MessageType.None);

            GUILayout.BeginVertical(EditorStyles.helpBox);
            GUILayout.Label($"• Texturen: {unusedTextures.Count}");
            GUILayout.Label($"• Materialien: {unusedMaterials.Count}");
            GUILayout.Label($"• Audio: {unusedAudio.Count}");
            GUILayout.Label($"• Prefabs: {unusedPrefabs.Count}");
            GUILayout.Label($"• 3D-Modelle: {unusedModels.Count}");
            GUILayout.Label($"• Animationen: {unusedAnimations.Count}");
            GUILayout.Label($"• Fonts: {unusedFonts.Count}");
            GUILayout.Label($"• Sonstiges: {unusedMisc.Count}");
            GUILayout.EndVertical();

            GUILayout.Space(20);

            if (totalCount > 0)
            {
                GUI.backgroundColor = new Color(0.9f, 0.3f, 0.3f);
                if (GUILayout.Button("💥 ALL LÖSCHEN", GUILayout.Height(45)))
                {
                    if (EditorUtility.DisplayDialog("Radikalreinigung", $"Möchtest du wirklich alle {totalCount} ungenutzten Assets aus ALLEN Kategorien auf einmal ins Backup verschieben?", "Ja, alles löschen!", "Abbrechen"))
                    {
                        DeleteFullList(unusedTextures);
                        DeleteFullList(unusedMaterials);
                        DeleteFullList(unusedAudio);
                        DeleteFullList(unusedPrefabs);
                        DeleteFullList(unusedModels);
                        DeleteFullList(unusedAnimations);
                        DeleteFullList(unusedFonts);
                        DeleteFullList(unusedMisc);

                        RemoveEmptyFolders(targetFolder);
                        AssetDatabase.Refresh();
                        EditorUtility.DisplayDialog("Projekt bereinigt", "Absolut alle ungenutzten Elemente wurden erfolgreich ins Backup verschoben!", "Super");
                    }
                }
                GUI.backgroundColor = Color.white;
            }
        }
        else if (currentTab == 9)
        {
            GUILayout.Label("Tool-Cache & Ansicht zurücksetzen", EditorStyles.boldLabel);
            EditorGUILayout.HelpBox("Löscht die alte Log-Datei, wirft ungenutzten Editor-RAM-Ballast ab und leert alle Listen in diesem Fenster für einen frischen Durchlauf.", MessageType.Info);

            GUILayout.Space(15);

            GUI.backgroundColor = new Color(0.3f, 0.6f, 0.9f);
            if (GUILayout.Button("🔄 ALL CLEAR", GUILayout.Height(40)))
            {
                if (EditorUtility.DisplayDialog("Cache & Listen leeren", "Möchtest du den Cache zurücksetzen und das Fenster für einen frischen Spieldurchlauf leeren?", "Ja, leeren", "Abbrechen"))
                {
                    ResetCacheAndLog();
                    currentTab = 0;
                }
            }
            GUI.backgroundColor = Color.white;
        }
        else
        {
            List<string> activeList = GetActiveList();
            GUILayout.Label($"Ungenutzte Elemente in dieser Kategorie: {activeList.Count}", EditorStyles.miniBoldLabel);

            scrollPos = GUILayout.BeginScrollView(scrollPos);
            for (int i = activeList.Count - 1; i >= 0; i--)
            {
                GUILayout.BeginHorizontal(EditorStyles.helpBox);
                GUILayout.Label(activeList[i], GUILayout.ExpandWidth(true));

                if (GUILayout.Button("Löschen", GUILayout.Width(70)))
                {
                    DeleteAndBackupAsset(activeList[i]);
                    activeList.RemoveAt(i);
                    RemoveEmptyFolders(targetFolder);
                    AssetDatabase.Refresh();
                }
                GUILayout.EndHorizontal();
            }
            GUILayout.EndScrollView();

            if (activeList.Count > 0 && GUILayout.Button("ALLE ungenutzten dieser Kategorie löschen", GUILayout.Height(35)))
            {
                if (EditorUtility.DisplayDialog("Release Vorbereitung", "Möchtest du wirklich alle ungenutzten Elemente dieser Kategorie ins Backup verschieben?", "Ja", "Nein"))
                {
                    DeleteFullList(activeList);
                    RemoveEmptyFolders(targetFolder);
                    AssetDatabase.Refresh();
                }
            }
        }
    }

    void ResetCacheAndLog()
    {
        string logFilePath = Path.Combine(Application.dataPath, "ComprehensiveUsedAssetsLog.txt");
        if (File.Exists(logFilePath)) File.Delete(logFilePath);

        unusedTextures.Clear(); unusedMaterials.Clear(); unusedAudio.Clear();
        unusedPrefabs.Clear(); unusedModels.Clear(); unusedAnimations.Clear();
        unusedFonts.Clear(); unusedMisc.Clear();

        EditorUtility.UnloadUnusedAssetsImmediate();
        AssetDatabase.Refresh();
        EditorUtility.DisplayDialog("Erfolg", "Der Cache wurde zurückgesetzt und die Ansicht geleert!", "Verstanden");
    }

    void AnalyzeProjectWithProgress()
    {
        unusedTextures.Clear(); unusedMaterials.Clear(); unusedAudio.Clear();
        unusedPrefabs.Clear(); unusedModels.Clear(); unusedAnimations.Clear();
        unusedFonts.Clear(); unusedMisc.Clear();

        HashSet<string> safePaths = new HashSet<string>();

        if (currentScanMode == ScanMode.LevelSpiel_Hybrid)
        {
            EditorUtility.DisplayProgressBar("Deep-Dive Analyse", "Phase 1/4: Lade Spieldurchlauf-Protokoll...", 0.1f);
            string logFilePath = Path.Combine(Application.dataPath, "ComprehensiveUsedAssetsLog.txt");
            if (File.Exists(logFilePath))
            {
                foreach (string line in File.ReadAllLines(logFilePath))
                {
                    if (!string.IsNullOrEmpty(line)) safePaths.Add(line.Trim().Replace("\\", "/"));
                }
            }
        }

        EditorUtility.DisplayProgressBar("Deep-Dive Analyse", "Phase 2/4: Scanne Level-Abhängigkeiten...", 0.2f);

#if UNITY_5
        string[] allSceneGuids = AssetDatabase.FindAssets("t:SceneAsset");
#else
        string[] allSceneGuids = AssetDatabase.FindAssets("t:Scene");
#endif
        List<string> scenePaths = new List<string>();


foreach (string guid in allSceneGuids)
{
    string scenePath = AssetDatabase.GUIDToAssetPath(guid);
    if (scenePath.StartsWith("Assets/"))
    {
        scenePaths.Add(scenePath);
        safePaths.Add(scenePath.Replace("\\", "/"));
    }
}

for (int s = 0; s < scenePaths.Count; s++)
{
    float progressPercent = 0.2f + ((float)s / scenePaths.Count) * 0.4f;
    EditorUtility.DisplayProgressBar("Deep-Dive Analyse", $"Phase 2/4: Durchleuchte Level: {Path.GetFileNameWithoutExtension(scenePaths[s])}", progressPercent);

    string[] sceneDependencies = AssetDatabase.GetDependencies(scenePaths[s], true);
    foreach (string depPath in sceneDependencies)
    {
        if (!string.IsNullOrEmpty(depPath) && depPath.StartsWith("Assets/"))
        {
            safePaths.Add(depPath.Replace("\\", "/"));
        }
    }

    GameObject[] allGameObjectsInProject = Resources.FindObjectsOfTypeAll<GameObject>();
    foreach (GameObject go in allGameObjectsInProject)
    {
        if (go != null && go.hideFlags == HideFlags.None && AssetDatabase.GetAssetPath(go) == "")
        {
            Object[] goDeps = EditorUtility.CollectDependencies(new Object[] { go });
            foreach (Object dep in goDeps)
            {
                if (dep == null) continue;
                string depPath = AssetDatabase.GetAssetPath(dep);
                if (!string.IsNullOrEmpty(depPath) && depPath.StartsWith("Assets/"))
                {
                    safePaths.Add(depPath.Replace("\\", "/"));
                }
            }
        }
    }
}

if (!Directory.Exists(targetFolder))
{
    EditorUtility.ClearProgressBar();
    EditorUtility.DisplayDialog("Fehler", "Der angegebene Ordner existiert nicht!", "Ok");
    return;
}

string[] allFiles = Directory.GetFiles(targetFolder, "*.*", SearchOption.AllDirectories);

for (int i = 0; i < allFiles.Length; i++)
{
    string path = allFiles[i].Replace("\\", "/");
    if (path.EndsWith(".meta")) continue;

    float progressPercent = 0.7f + ((float)i / allFiles.Length) * 0.3f;
    EditorUtility.DisplayProgressBar("Deep-Dive Analyse", $"Phase 4/4: Gleiche Datei ab: {Path.GetFileName(path)}", progressPercent);

    string ext = Path.GetExtension(path).ToLower();

    if (currentScanMode == ScanMode.OpenWorld_ReinStatisch)
    {
        if (path.Contains("/Resources/") || path.Contains("/Addressables/") || path.Contains("/AddressableAssetsData/"))
        {
            continue;
        }
    }

    if (ext == ".cs" || ext == ".unity" || ext == ".asmdef" || ext == ".cginc" || ext == ".lighting" ||
        ext == ".shadergraph" || ext == ".asset" || ext == ".prefab" ||
        ext == ".wav" || ext == ".mp3" || ext == ".ogg" || ext == ".aif" ||
        ext == ".vfx" || ext == ".particle" ||
        ext == ".rendererextension" || ext == ".signal" || ext == ".hlsl" || ext == ".inputactions")
    {
        continue;
    }

    if (path.Contains("/TextMesh Pro/") || path.Contains("/Editor/") || path.Contains("/PackageChecker/"))
    {
        continue;
    }

    if (!safePaths.Contains(path))
    {
        CategorizeAsset(path);
    }
}

EditorUtility.ClearProgressBar();
EditorUtility.DisplayDialog("Analyse Beendet", $"Erfolgreich abgeschlossen im universellen Modus!", "Perfekt");
    }

    void CategorizeAsset(string path)
{
    string ext = Path.GetExtension(path).ToLower();

    if (ext == ".png" || ext == ".jpg" || ext == ".tga" || ext == ".psd" || ext == ".tif" || ext == ".exr" || ext == ".hdr")
        unusedTextures.Add(path);
    else if (ext == ".mat" || ext == ".physicmaterial" || ext == ".physicsmaterial2d" || ext == ".cubemap")
        unusedMaterials.Add(path);
    else if (ext == ".wav" || ext == ".mp3" || ext == ".ogg" || ext == ".aif" || ext == ".audiomixer")
        unusedAudio.Add(path);
    else if (ext == ".prefab")
        unusedPrefabs.Add(path);
    else if (ext == ".fbx" || ext == ".obj" || ext == ".max" || ext == ".blend")
        unusedModels.Add(path);
    else if (ext == ".anim" || ext == ".controller" || ext == ".overridecontroller" || ext == ".mask")
        unusedAnimations.Add(path);
    else if (ext == ".ttf" || ext == ".otf" || ext == ".fontsettings")
        unusedFonts.Add(path);
    else
        unusedMisc.Add(path);
}

List<string> GetActiveList()
{
    return currentTab switch
    {
        1 => unusedTextures,
        2 => unusedMaterials,
        3 => unusedAudio,
        4 => unusedPrefabs,
        5 => unusedModels,
        6 => unusedAnimations,
        7 => unusedFonts,
        _ => unusedMisc
    };
}

void DeleteFullList(List<string> list)
{
    List<string> toDelete = new List<string>(list);
    foreach (string path in toDelete)
    {
        DeleteAndBackupAsset(path);
    }
    list.Clear();
}

void DeleteAndBackupAsset(string assetPath)
{
    if (string.IsNullOrEmpty(assetPath) || !File.Exists(assetPath)) return;

    string fullProjectPath = Path.GetDirectoryName(Application.dataPath);
    string globalBackupDir = Path.Combine(fullProjectPath, backupFolder);
    string targetBackupPath = Path.Combine(globalBackupDir, assetPath);
    string targetBackupMetaPath = targetBackupPath + ".meta";
    string directory = Path.GetDirectoryName(targetBackupPath);

    if (!Directory.Exists(directory)) Directory.CreateDirectory(directory);

    if (File.Exists(assetPath)) File.Move(assetPath, targetBackupPath);
    if (File.Exists(assetPath + ".meta")) File.Move(assetPath + ".meta", targetBackupMetaPath);
}

void RestoreBackup()
{
    string fullProjectPath = Path.GetDirectoryName(Application.dataPath);
    string globalBackupDir = Path.Combine(fullProjectPath, backupFolder);

    if (!Directory.Exists(globalBackupDir))
    {
        EditorUtility.DisplayDialog("Sicherheitsnetz", "Kein Backup gefunden!", "Ok");
        return;
    }

    string[] backupFiles = Directory.GetFiles(globalBackupDir, "*.*", SearchOption.AllDirectories);
    foreach (string backupFile in backupFiles)
    {
        string relativePath = backupFile.Substring(globalBackupDir.Length + 1).Replace("\\", "/");
        string absoluteTargetPath = Path.Combine(fullProjectPath, relativePath);
        string targetDirectory = Path.GetDirectoryName(absoluteTargetPath);

        if (!Directory.Exists(targetDirectory)) Directory.CreateDirectory(targetDirectory);
        if (File.Exists(absoluteTargetPath)) File.Delete(absoluteTargetPath);

        File.Move(backupFile, absoluteTargetPath);
    }

    Directory.Delete(globalBackupDir, true);
    AssetDatabase.Refresh();
    AnalyzeProjectWithProgress();
    EditorUtility.DisplayDialog("Erfolg", "Alle Daten wiederhergestellt!", "Ok");
}

void RemoveEmptyFolders(string startFolder)
{
    if (!Directory.Exists(startFolder)) return;

    foreach (var directory in Directory.GetDirectories(startFolder))
    {
        RemoveEmptyFolders(directory);
    }

    if (Directory.GetFiles(startFolder).Length == 0 && Directory.GetDirectories(startFolder).Length == 0)
    {
        if (startFolder != "Assets" && startFolder != "Assets/")
        {
            Directory.Delete(startFolder, false);
            if (File.Exists(startFolder + ".meta")) File.Delete(startFolder + ".meta");
        }
    }
}
}
